import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../../styles/styles";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Slider {...settings}>
        {/* Slide 1 */}
        <div
          className={`relative min-h-[40vh] 800px:min-h-[50vh] w-full bg-cover bg-center bg-no-repeat bg-[url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKRJta3pCT7TICEPp3XSFM5r898O_tz_RCcw&s)]`}
        >
          <div
            className={`relative z-10 ${styles.section} w-[90%] 800px:w-[60%]`}
            style={{ marginTop: "60px", textAlign: "center" }}
          >
            <h1 className="text-[30px] 800px:text-[55px] font-extrabold leading-tight" style={{color: 'black'}}>
              Best Collection Of <br /> Clothing Store
            </h1>
            <p className="pt-5 text-[16px] 800px:text-[20px] font-bold text-black" style={{color: 'black'}}>
              Explore Clothings that meets top safety and reliability standards.
            </p>
          </div>
        </div>

        {/* Slide 2 */}
        <div
          className={`relative min-h-[40vh] 800px:min-h-[50vh] w-full bg-cover bg-center bg-no-repeat bg-[url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69VjSBJSsnXpDE2gn8hbzo7zIPlLSzvv-0FkBiKIuHpfe06ld3q0KBcIoP4LXfsx2Omg&usqp=CAU)]`}
        >
          <div
            className={`relative z-10 ${styles.section} w-[90%] 800px:w-[60%]`}
            style={{ marginTop: "60px", textAlign: "center" }}
          >
            <h1 className="text-[30px] 800px:text-[55px] font-extrabold leading-tight text-black">
              Shop Anytime, Anywhere
            </h1>
            <p className="pt-5 text-[16px] 800px:text-[20px] font-bold text-black">
              Get high-quality medical equipment designed for durability and precision.
            </p>
          </div>
        </div>

        {/* Slide 3 */}
       
      </Slider>
    </div>
  );
};

export default Hero;
