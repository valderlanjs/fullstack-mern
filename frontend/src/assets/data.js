import img1 from './Products/Decks/decdecumaru2.jpg'
import img2 from './Products/Decks/deckdecumaru.jpg'
import img3 from './Products/Madeira/Macaranduba.jpg'
import img4_1 from './Products/Decks/deckdemacaranduba.jpg'
import img4_2 from './Products/Decks/deckdjatoba.jpg'
import img4_3 from './Products/Escadas/escadasdemadeira.jpg'
import img4_4 from './Products/Escadas/esquadrias.jpg'
import img5 from './Products/Escadas/esquadrias2.jpg'
import img6 from './popularImg/pergoladoPo.webp'
import img7 from './popularImg/forroPo.jpg'
import img8 from './popularImg/esquadriasPo.jpg'
import img9 from './Products/Escadas/esquadrias3.jpg'
import img10 from './Products/Escadas/janelas.webp'
import img11 from './Products/Escadas/janelasdejatoba.jpg'
import img12 from './Products/Escadas/porta parapintura2.webp'
import img13 from './Products/Escadas/portadeficha.jpg'
import img14 from './Products/Escadas/portadejatoba.jpg'
import img15 from './Products/Madeira/Eucalipto.png'
import img16 from './Products/Madeira/Eucalipto.png'
import img17 from './Products/Madeira/Eucalipttratado.webp'
import img18 from './Products/Madeira/Jatoba.jpg'
import img19 from './Products/Madeira/Macaranduba.jpg'
import img20 from './Products/Madeira/Madeiriteplastificado.jpg'
import img21 from './Products/Madeira/madeiriteresinado.jpg'
import img22 from './Products/Madeira/pequi.jpg'
import img23 from './Products/Cobertas/brasilit.webp'
import img24 from './Products/Cobertas/PVC.webp'
import img25 from './Products/Cobertas/simonassi.jpg'
import img26 from './Products/Cobertas/telhacolonial.webp'
import img27 from './Products/Cobertas/telhacolonialdepvc.jpg'
import img28 from './Products/Cobertas/telhamacaranduba.jpg'
import img29 from './Products/Cobertas/telhasbrasilit.webp'
import img30 from './Products/Cobertas/telhasimonasse.jpg'
import img31 from './Products/Pergolados/PergoladodeEucaliptotratado.webp'
import img32 from './Products/Pergolados/pergoladodejatoba.jpeg'
import img33 from './Products/Pergolados/PergoladosdeMacaranduba.jpg'
import img34 from './Products/Ripados/ripadosdejatoba.jpg'
import img35 from './Products/Ripados/ripadosdejatoba2.jpg'
import img36 from './Products/Ripados/ripadosdemacaranduba.jpg'
import img37 from './Products/Ripados/ripadosdemacaranduba2.jpg'
import img38 from './Products/Ripados/ripadosdemacaranduba3.jpg'
import img39 from './Products/Outros/arruelas.jpg'
import img40 from './Products/Outros/bestfer.png'
import img41 from './Products/Outros/black e decker.png'
import img42 from './Products/Outros/bucha.jpg'
import img43 from './Products/Outros/buxas.jpg'
import img44 from './Products/Outros/cadeado.webp'
import img45 from './Products/Outros/dobradica.webp'
import img46 from './Products/Outros/fechadura.jpg'
import img47 from './Products/Outros/ferramentasbestfer.jpg'
import img48 from './Products/Outros/ferramentassilvana.webp'
import img49 from './Products/Outros/ferramentasblackdecker.jpg'
import img50 from './Products/Outros/ferramentasstarret.jpg'
import img51 from './Products/Outros/ferramentassilvana.webp'
import img52 from './Products/Outros/ferrolho.jpg'


export const products = [
    {
        _id: "1",
        name: "Decker Cumaru",
        description: "This lightweight cotton top is perfect for casual outings, featuring a relaxed fit and durable material.",
        price: 150,
        image: [img1],
        category: "Decks",
        subCategory: "Cumaru",
        sizes: ["S", "M", "L"],
        date: 1716634345448,
        popular: false
    },
    {
        _id: "2",
        name: "Deck de Ipê",
        description: "A premium t-shirt offering exceptional comfort and a smooth texture, great for everyday wear.",
        price: 220,
        image: [img2],
        category: "Decks",
        subCategory: "Ipê",
        sizes: ["M", "L", "XL"],
        date: 1716621345448,
        popular: false
    },
    {
        _id: "3",
        name: "Madeiras Bruta",
        description: "Soft cotton top for girls, ideal for both active play and relaxation.",
        price: 200,
        image: [img3],
        category: "Madeira Bruta",
        subCategory: "Maçaranduba",
        sizes: ["S", "L", "XL"],
        date: 1716234545448,
        popular: true
    },
    {
        _id: "4",
        name: "Deck de Jatobá",
        description: "A casual t-shirt made from breathable cotton, suitable for any informal occasion.",
        price: 180,
        image: [img4_1, img4_2, img4_3, img4_4],
        category: "Decks",
        subCategory: "Jatobá",
        sizes: ["S", "M", "XXL"],
        date: 1716621345448,
        popular: false
    },
    {
        _id: "5",
        name: "Stylish Women Basic Tee",
        description: "An everyday essential cotton tee for women, offering simplicity and comfort.",
        price: 140,
        image: [img5],
        category: "Escadas",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        date: 1716622345448,
        popular: false
    },
    {
        _id: "6",
        name: "Pergolados",
        description: "Fun and vibrant graphic tee, perfect for kids’ outdoor play and adventures.",
        price: 160,
        image: [img6],
        category: "Pergolados",
        subCategory: "Jatobá",
        sizes: ["XS", "S", "M"],
        date: 1716623345448,
        popular: true
    },
    {
        _id: "7",
        name: "Forros de Madeira",
        description: "A comfortable, lightweight knit sweater ideal for layering during cool weather.",
        price: 320,
        image: [img7],
        category: "Forro",
        subCategory: "Pinus",
        sizes: ["S", "M", "L", "XL"],
        date: 1716624345448,
        popular: true
    },
    {
        _id: "8",
        name: "Esquadrias",
        description: "Warm and comfortable hoodie with an adjustable hood and front pockets.",
        price: 420,
        image: [img8],
        category: "Esquadrias",
        subCategory: "Eucalípto",
        sizes: ["M", "L", "XL", "XXL"],
        date: 1716625345448,
        popular: true
    },
    {
        _id: "9",
        name: "Esquadrias de Madeira",
        description: "A casual hoodie designed for boys, featuring a soft material for all-day comfort.",
        price: 230,
        image: [img9],
        category: "Esquadrias",
        subCategory: "Eucalípto",
        sizes: ["S", "M", "L"],
        date: 1716626345448,
        popular: false
    },
    {
        _id: "10",
        name: "Men Jogger Pants",
        description: "These high-waisted joggers are ideal for casual wear and feature a relaxed fit for added comfort.",
        price: 260,
        image: [img10],
        category: "Esquadrias",
        subCategory: "Eucalípto",
        sizes: ["S", "M", "L", "XL"],
        date: 1716627345448,
        popular: false
    },
    {
        _id: "11",
        name: "Classic Slim Fit Jeans",
        description: "Durable and stylish slim fit jeans, suitable for both casual and formal outfits.",
        price: 380,
        image: [img11],
        category: "Esquadrias",
        subCategory: "Mista",
        sizes: ["M", "L", "XL"],
        date: 1716628345448,
        popular: true
    },
    {
        _id: "12",
        name: "Men Playtime Joggers",
        description: "Comfortable joggers made for active kids, featuring an elastic waistband for easy wear.",
        price: 170,
        image: [img12],
        category: "Esquadrias",
        subCategory: "Mista",
        sizes: ["S", "M", "L"],
        date: 1716629345448,
        popular: false
    },
    {
        _id: "13",
        name: "Women Skinny Fit Jeans",
        description: "Trendy mid-rise skinny jeans, made to pair well with any top for a chic look.",
        price: 290,
        image: [img13],
        category: "Esquadrias",
        subCategory: "Mista",
        sizes: ["S", "M", "L", "XL"],
        date: 1716630345448,
        popular: true
    },
    {
        _id: "14",
        name: "Functional Kids Cargo Pants",
        description: "Rugged cargo pants featuring multiple pockets, ideal for casual or outdoor adventures.",
        price: 290,
        image: [img14],
        category: "Esquadrias",
        subCategory: "Pinus",
        sizes: ["M", "L", "XL", "XXL"],
        date: 1716631345448,
        popular: false
    },
    {
        _id: "15",
        name: "Boys Adventure Shorts",
        description: "Comfortable elastic waist shorts designed for active boys, ideal for play and outdoor activities.",
        price: 150,
        image: [img15],
        category: "Madeira Bruta",
        subCategory: "Maçaranduba",
        sizes: ["XS", "S", "M"],
        date: 1716632345448,
        popular: true
    },
    {
        _id: "16",
        name: "Floral Print Leggings",
        description: "Soft and stretchy floral print leggings, perfect for comfort and style.",
        price: 210,
        image: [img16],
        category: "Madeira Bruta",
        subCategory: "Maçaranduba",
        sizes: ["S", "M", "L"],
        date: 1716633345448,
        popular: true
    },
    {
        _id: "17",
        name: "Men Lightweight Puffer Jacket",
        description: "Stylish and warm puffer jacket, great for layering in chilly weather.",
        price: 490,
        image: [img17],
        category: "Madeira Bruta",
        subCategory: "Maçaranduba",
        sizes: ["M", "L", "XL"],
        date: 1716634345448,
        popular: true
    },
    {
        _id: "18",
        name: "Classic Women Trench Coat",
        description: "A timeless trench coat with a tailored fit, perfect for any occasion.",
        price: 610,
        image: [img18],
        category: "Madeira Bruta",
        subCategory: "Eucalípto Tratado",
        sizes: ["S", "M", "L", "XL"],
        date: 1716635345448,
        popular: false
    },
    {
        _id: "19",
        name: "Boys Winter Parka",
        description: "Warm winter parka with a durable build, designed to withstand cold temperatures.",
        price: 350,
        image: [img19],
        category: "Madeira Bruta",
        subCategory: "Eucalípto Tratado",
        sizes: ["S", "M", "L"],
        date: 1716636345448,
        popular: false
    },
    {
        _id: "20",
        name: "Girls Classic Denim Trouser",
        description: "A versatile denim jacket for girls, great for layering in all seasons.",
        price: 260,
        image: [img20],
        category: "Madeira Bruta",
        subCategory: "Madeirite",
        sizes: ["S", "M", "L"],
        date: 1716637345448,
        popular: true
    },
    {
        _id: "21",
        name: "Women Wool Blend Sweater",
        description: "This warm wool blend sweater provides both comfort and a stylish look.",
        price: 360,
        image: [img21],
        category: "Madeira Bruta",
        subCategory: "Eucalípto Tratado",
        sizes: ["S", "M", "L", "XL"],
        date: 1716638345448,
        popular: true
    },
    {
        _id: "22",
        name: "Men Rugged Denim Trouser",
        description: "Durable denim jacket with a vintage finish, suitable for layering in all seasons.",
        price: 400,
        image: [img22],
        category: "Madeira Bruta",
        subCategory: "Angelim Pedra",
        sizes: ["M", "L", "XL"],
        date: 1716639345448,
        popular: false
    },
    {
        _id: "23",
        name: "Kids Fleece Hoodie",
        description: "Soft and cozy fleece hoodie, perfect for active kids.",
        price: 190,
        image: [img23],
        category: "Cobertas",
        subCategory: "Angelim Pedra",
        sizes: ["S", "M", "L"],
        date: 1716640345448,
        popular: false
    },
    {
        _id: "24",
        name: "Kids Faux Leather Moto Jacket",
        description: "Trendy faux leather jacket with sleek zipper details, adding an edgy touch to any outfit.",
        price: 470,
        image: [img24],
        category: "Cobertas",
        subCategory: "Angelim Pedra",
        sizes: ["S", "M", "L"],
        date: 1716641345448,
        popular: true
    },
    {
        _id: "25",
        name: "Kids Winter Tshirt",
        description: "Soft winter gloves with a fleece lining, designed to keep hands warm.",
        price: 100,
        image: [img25],
        category: "Cobertas",
        subCategory: "Angelim Pedra",
        sizes: ["M", "L"],
        date: 1716642345448,
        popular: true
    },
    {
        _id: "26",
        name: "Women Cashmere Scarf",
        description: "Elegant cashmere scarf, ideal for adding warmth and a touch of luxury.",
        price: 80,
        image: [img26],
        category: "Cobertas",
        subCategory: "Brasilit",
        sizes: ["One Size"],
        date: 1716643345448,
        popular: false
    },
    {
        _id: "27",
        name: "Kids Cozy Beanie",
        description: "Warm and comfortable beanie, ideal for keeping kids warm during cold days.",
        price: 60,
        image: [img27],
        category: "Cobertas",
        subCategory: "Brasilit",
        sizes: ["One Size"],
        date: 1716644345448,
        popular: false
    },
    {
        _id: "28",
        name: "Men Classic Leather Belt",
        description: "High-quality leather belt with a durable buckle, perfect for formal wear.",
        price: 140,
        image: [img28],
        category: "Cobertas",
        subCategory: "Brasilit",
        sizes: ["M", "L", "XL"],
        date: 1716645345448,
        popular: false
    },
    {
        _id: "29",
        name: "Women Sun Hat",
        description: "Wide-brimmed sun hat, perfect for beach days and outdoor activities.",
        price: 120,
        image: [img29],
        category: "Cobertas",
        subCategory: "PVC",
        sizes: ["One Size"],
        date: 1716646345448,
        popular: true
    },
    {
        _id: "30",
        name: "Kids Polarized Sunglasses",
        description: "Stylish polarized sunglasses for kids, providing excellent UV protection.",
        price: 60,
        image: [img30],
        category: "Cobertas",
        subCategory: "PVC",
        sizes: ["One Size"],
        date: 1716647345448,
        popular: true
    },

    {
        _id: "31",
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 220,
        image: [img31],
        category: "Pergolados",
        subCategory: "PVC",
        sizes: ["S", "M", "L", "XL"],
        date: 1716645345448,
        popular: false
    },
    {
        _id: "32",
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 250,
        image: [img32],
        category: "Pergolados",
        subCategory: "PVC",
        sizes: ["S", "M", "L", "XL"],
        date: 1716646445448,
        popular: false
    },
    {
        _id: "33",
        name: "Girls Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 230,
        image: [img33],
        category: "Pergolados",
        subCategory: "PVC",
        sizes: ["S", "M", "L", "XL"],
        date: 1716647545448,
        popular: false
    },
    {
        _id: "34",
        name: "Women Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 260,
        image: [img34],
        category: "Ripados",
        subCategory: "Pequí",
        sizes: ["S", "M", "L", "XL"],
        date: 1716648645448,
        popular: false
    },
    {
        _id: "35",
        name: "Women Zip-Front Relaxed Fit Jacket",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 240,
        image: [img35],
        category: "Ripados",
        subCategory: "Pequí",
        sizes: ["S", "M", "L", "XL"],
        date: 1716649745448,
        popular: false
    },
    {
        _id: "36",
        name: "Women Zip-Front Relaxed black T-shirt",
        description: "Soft and stretchy floral print leggings, perfect for comfort and style.",
        price: 270,
        image: [img36],
        category: "Ripados",
        subCategory: "Pequí",
        sizes: ["S", "M", "L", "XL"],
        date: 1716650845448,
        popular: false
    },
    {
        _id: "37",
        name: "Women Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 250,
        image: [img37],
        category: "Ripados",
        subCategory: "Pequí",
        sizes: ["S", "M", "L", "XL"],
        date: 1716651945448,
        popular: false
    },
    {
        _id: "38",
        name: "Kids Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 280,
        image: [img38],
        category: "Ripados",
        subCategory: "Pequí",
        sizes: ["S", "M", "L", "XL"],
        date: 1716653045448,
        popular: false
    },
    {
        _id: "39",
        name: "Men Printed Plain Cotton Shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 260,
        image: [img39],
        category: "Outros",
        subCategory: "Pequí",
        sizes: ["S", "M", "L", "XL"],
        date: 1716654145448,
        popular: false
    },
    {
        _id: "40",
        name: "Men Slim Fit Relaxed Denim Jacket",
        description: "An everyday essential cotton tee for women, offering simplicity and comfort.",
        price: 290,
        image: [img40],
        category: "Outros",
        subCategory: "Pequí",
        sizes: ["S", "M", "L", "XL"],
        date: 1716655245448,
        popular: false
    },
    {
        _id: "41",
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 270,
        image: [img41],
        category: "Outros",
        subCategory: "Cumaru",
        sizes: ["S", "M", "L", "XL"],
        date: 1716656345448,
        popular: false
    },
    {
        _id: "42",
        name: "Boy Round Neck Pure Cotton T-shirt",
        description: "An everyday essential cotton tee for women, offering simplicity and comfort.",
        price: 300,
        image: [img42],
        category: "Outros",
        subCategory: "Cumaru",
        sizes: ["S", "M", "L", "XL"],
        date: 1716657445448,
        popular: false
    },
    {
        _id: "43",
        name: "Kid Tapered Slim Fit Trouser",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 280,
        image: [img43],
        category: "Outros",
        subCategory: "Jatobá",
        sizes: ["S", "M", "L", "XL"],
        date: 1716658545448,
        popular: false
    },
    {
        _id: "44",
        name: "Women Zip-Front Relaxed Fit Jacket",
        description: "A timeless trench coat with a tailored fit, perfect for any occasion",
        price: 310,
        image: [img44],
        category: "Outros",
        subCategory: "Jatobá",
        sizes: ["S", "M", "L", "XL"],
        date: 1716659645448,
        popular: false
    },
    {
        _id: "45",
        name: "Men Slim Fit Relaxed Denim Jacket",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 290,
        image: [img45],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716660745448,
        popular: false
    },
    {
        _id: "46",
        name: "Men Slim Fit Relaxed Denim Shirt",
        description: "A timeless trench coat with a tailored fit, perfect for any occasion.",
        price: 320,
        image: [img46],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716661845448,
        popular: false
    },
    {
        _id: "47",
        name: "Kid Tapered Slim Fit Trouser",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 300,
        image: [img47],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716662945448,
        popular: false
    },
    {
        _id: "48",
        name: "Men Slim Fit Relaxed Denim Jacket",
        description: "A timeless trench coat with a tailored fit, perfect for any occasion.",
        price: 330,
        image: [img48],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716664045448,
        popular: false
    },
    {
        _id: "49",
        name: "Women Tapered Slim Fit Trouser",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 310,
        image: [img49],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716665145448,
        popular: false
    },
    {
        _id: "50",
        name: "Kids Tapered Slim Fit Trouser",
        description: "A timeless trench coat with a tailored fit, perfect for any occasion.",
        price: 340,
        image: [img50],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716666245448, popular: false
    },
    {
        _id: "51",
        name: "Women Zip-Front Relaxed Fit Shirt",
        description: "A timeless trench coat with a tailored fit, perfect for any occasion",
        price: 320,
        image: [img51],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716667345448,
        popular: false
    },
    {
        _id: "52",
        name: "Men Slim Fit Relaxed Denim Shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 350,
        image: [img52],
        category: "Outros",
        subCategory: "Ipê",
        sizes: ["S", "M", "L", "XL"],
        date: 1716668445448,
        popular: false
    }

]