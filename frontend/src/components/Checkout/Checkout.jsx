import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { server } from '../../server';
import Loading from '../Layout/Loader';
import { toast } from 'react-toastify';
import { getAllOrdersOfAdmin } from '../../redux/actions/order';

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (fmr. Swaziland)",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (formerly Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Paystack configuration
  const paystackPublicKey = "pk_test_d556bd38532ad45ef5cb38cf11d6d6c2edb194e5";

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  // Calculate shipping fee (30% of totalPrice)
  const shippingFee = (totalPrice * 0.3).toFixed(2);
  // Total amount including shipping (in kobo for Paystack)
  const totalAmount = (totalPrice + parseFloat(shippingFee)).toFixed(2);
  const amountInKobo = Math.round(parseFloat(totalAmount) * 100); // Convert to kobo

  useEffect(() => {
    if (!cart.length) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleShippingAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      setMessage('Please fill in all shipping fields.');
      return;
    }
    setMessage('Shipping address saved successfully.');
  };

  // Paystack configuration object
  const paystackConfig = {
    reference: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    email: user?.email || '',
    amount: amountInKobo,
    publicKey: paystackPublicKey,
    text: "Pay with Paystack",
    onSuccess: async (reference) => {
      setLoading(true);
      try {
        // Send order details to backend
        await axios.post(`${server}/order/online-payment?platform=paystack`, {
          shippingAddress,
          totalPrice: totalAmount,
          user: user._id,
          cart,
          email: user.email,
          reference: reference.reference,
          transaction: reference.transaction,
        });
        
        setMessage('Order placed successfully with Paystack! Check your email for confirmation.');
        dispatch(getAllOrdersOfAdmin());
        
        // Redirect to success page or clear cart
        // navigate('/order-success');
        
      } catch (error) {
        console.error('Order placement error:', error);
        setMessage('Failed to place order. Please contact support.');
      } finally {
        setLoading(false);
      }
    },
    onClose: () => {
      setMessage('Payment cancelled. You can try again when ready.');
    },
    metadata: {
      custom_fields: [
        {
          display_name: "Cart Items",
          variable_name: "cart_items",
          value: cart.length.toString()
        },
        {
          display_name: "Customer Name",
          variable_name: "customer_name", 
          value: `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
        }
      ]
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>
      {loading && <Loading />}
      
      <div className="bg-white p-5 rounded shadow-sm">
        {/* Order Summary */}
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p>Quantity: {item.qty}</p>
              <p>Discount Price: ${item.discountPrice}</p>
            </div>
            <p className="font-medium">${(item.qty * item.discountPrice).toFixed(2)}</p>
          </div>
        ))}
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center font-semibold text-lg">
            <p>Subtotal:</p>
            <p>${totalPrice}</p>
          </div>
          <div className="flex justify-between items-center font-semibold text-lg">
            <p>Shipping Fee:</p>
            <p>${shippingFee}</p>
          </div>
          <div className="flex justify-between items-center font-bold text-xl border-t pt-2 mt-2">
            <p>Total Amount:</p>
            <p>${totalAmount}</p>
          </div>
        </div>

        {/* Shipping Address Form */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Country</label>
              <select
                name="country"
                value={shippingAddress.country}
                onChange={handleShippingAddressChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              >
                <option value="" disabled>
                  Select your country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Save Shipping Address
            </button>
            
            {message && <p className={`mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
          </form>
        </div>

        {/* Payment Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Pay with Paystack</h3>
            <p className="text-green-700 mb-4">
              Secure payment processing with cards, bank transfers, and mobile money.
            </p>
            
            <ul className="text-sm text-green-600 mb-4 space-y-1">
              <li>• You will receive an order confirmation email after successful payment</li>
              <li>• All transactions are secure and encrypted</li>
              <li>• Multiple payment options available</li>
            </ul>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Amount to Pay:</span>
              <span className="text-2xl font-bold text-green-700">${totalAmount}</span>
            </div>

            {/* Validate shipping address before showing payment button */}
            {shippingAddress.address && shippingAddress.city && shippingAddress.postalCode && shippingAddress.country ? (
              <PaystackButton
                {...paystackConfig}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              />
            ) : (
              <div className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg text-center">
                Please complete shipping address to proceed with payment
              </div>
            )}
          </div>
        </div>

        {/* Back to Cart Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/cart" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;