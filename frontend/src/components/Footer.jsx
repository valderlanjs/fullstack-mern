import { Link } from "react-router-dom";
import { 
    BsEnvelopeFill, 
    BsFacebook, 
    BsGeoAltFill, 
    BsInstagram, 
    BsTelephoneFill, 
} from "react-icons/bs"

const Footer = () => {
    return (
        <footer className="max-padd-container mt-10">
            <div className="max-padd-container bg-black text-white py-10 rounded-tr-3xl rounded-tl-3xl">
                <div className="container max-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* LOGO*/}
                    <div>
                        <Link to='/'>
                            <img src="/logo.png" alt="" className="w-36 h-32"/>
                        </Link>
                        <p className="text-white mt-5">
                        Compromisso com a qualidade e sustentabilidade. Nossa madeira, sua confiança.
                        </p>
                        <p className="mt-4 text-white">
                            Copyright 2024 Madenobre. Todos os direitos reservados.
                        </p>
                    </div>
                    {/* LINKS RÁPIDOS */}
                    <div>
                        <h4 className="h4 mb-4">
                            Links Rápidos
                        </h4>
                        <ul className="space-y-2 regular-15">
                            <li className="text-gray-10">
                                <a href="/about">Sobre Nos</a>
                            </li>
                            <li className="text-gray-10">
                                <a href="/properties">Produtos</a>
                            </li>
                            <li className="text-gray-10">
                                <a href="/services">Serviços</a>
                            </li>
                            <li className="text-gray-10">
                                <a href="/contact">Contato</a>
                            </li>
                            
                        </ul>
                    </div>
                    {/* CONTATO Info*/}
                    <div>
                        <h4 className="h4 mb-4">Contate-nos</h4>
                        <p className="text-gray-10 mb-2">
                            <BsTelephoneFill className="inline-block mr-2" /> +55 (82) 000-0000
                        </p>
                        <p className="text-gray-10 mb-2">
                            <BsEnvelopeFill className="inline-block mr-2" /> {" "} valderlanjosr15@gmail.com
                        </p>
                        <p className="text-gray-10 mb-2">
                            <BsGeoAltFill className="inline-block mr-2" /> {" "} Av. Juca Sampaio 2817 - Jacintinho, Maceió - AL, 57040-600
                        </p>
                    </div>
                    {/* SOCIAL MEDIA */}
                    <div>
                        <h4 className="mb-4 h4">Nossas Redes Sociais</h4>
                        <div className="flex space-x-4">
                            <a href=""><BsFacebook className="text-socialFa"/></a>
                            <a href=""><BsInstagram className="text-socialIns"/></a>
                        </div>
                    </div>
                </div>
            
            </div>
        </footer>
    )
}

export default Footer;