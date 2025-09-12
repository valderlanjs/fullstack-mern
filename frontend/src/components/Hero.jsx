import axios from "axios";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Hero = () => {
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/hero/image`);
      if (response.data.success && response.data.images) {
        setBanners(response.data.images);
        console.log(banners);
      }
    } catch (error) {
      console.log("Erro ao obter banners", error);
      toast.error("Erro ao obter banners do hero");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <section className="max-padd-container max-xl:mt-8 mb-16">
      {banners.length > 0 ? (
        <Swiper
          modules={[Autoplay, ]}
          autoplay={{ delay: 3000 }}
          loop
          
          className="h-[550px] w-full rounded-tl-3xl rounded-tr-3xl mt-6"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div
                className="bg-cover bg-center bg-no-repeat h-[550px] w-full rounded-tl-3xl rounded-tr-3xl relative"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                {/*<div className="relative max-w-[777px] top-80 flex flex-col items-start max-[968px]:justify-center max-[968px]:items-center max-[968px]:pt-20">
                  <h1 className="text-white mt-8 font-dancing medium-48 max-w-[411px] pl-2 mb-2 border-l-4 border-l-secondary max-[968px]:text-center max-[968px]:pl-0 max-[968px]:border-none">
                    O melhor em madeiras você encontra aqui!
                  </h1>
                  <div className="pl-10 flex gap-2 sm:gap-6 mt-20 max-[968px]:mt-2">
                    <Link
                      className="flex items-center gap-2 btn-secondary max-sm:!p-3 hover:bg-wood"
                      to="/contact"
                    >
                      Faça um orçamento <FaWhatsapp />
                    </Link>
                  </div>
                </div>*/}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>Carregando banners...</p>
      )}
    </section>
  );
};

export default Hero;
