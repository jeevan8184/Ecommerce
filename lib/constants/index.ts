
export const ADDRESS="ADDRESS"
export const RECENTVIEW="RECENTVIEW"
export const ALLPRODUCTS="ALLPRODUCTS"
export const SEARCHPRODUCTS="SEARCHPRODUCTS"
export const GETRELATED="GETRELATED"
export const GETRELATEDCART="GETRELATEDCART"
export const ALLCARTS="ALLCARTS"
export const ALLSAVED="ALLSAVED"
export const ALLORDERS="ALLORDERS"

export const SignInInitVals={
    email:'',
    password:''
}

export const SignUpInitVals={
    username:'',
    email:'',
    password:'',
    cpassword:''
}

export const AddressInitVals={
    firstname:"",
    pincode:"",
    state:"",
    town:"",
    houseNo:"",
    area:""
}

export const ResetPassInitVals={
    password:'',
    cpassword:''
}

export const AllRoutes=[
    {
        link:"/",
        label:"Home"
    },
    {
        link:"/profile",
        label:"Profile"
    },
    {
        link:"/orders",
        label:"Orders"
    },
    {
        link:"/cart",
        label:"Cart"
    },
]

export const productInitVals = {
    title: '',
    description: '',
    cateogory: '',
    price: '',
    stock: '',
    discount: '',
    tags: '',
    product1: {
      color: '',
      images: []
    },
    product2: {
      color: '',
      images: []
    }
}

export const HomeImgs=[
    {
        label:"watches",
        img:"/assets/images/watch.png",
        link:"/products/watches"
    },
    {
        label:"dresses",
        img:"/assets/images/dress.png",
        link:"/products/mens wear"
    },
    {
        label:"headphones",
        img:"/assets/images/headphones.png",
        link:"/products/headphones"
    },
    {
        label:"shoes",
        img:"/assets/images/shoe.png",
        link:"/products/shoes"
    },
    {
        label:"normal",
        img:"/assets/images/normal.png",
        link:"/products/normal use"
    },
] 

export const HomeWatches=[
    {
        title:"Noise Smartwatches",
        dec:"From ₹899",
        img:"/assets/watches/watch1.png",
        description:"Stylish and affordable smartwatche"
    },
    {
        title:"Fastrack Smartwatches",
        dec:"From ₹1,299",
        img:"/assets/watches/watch2.png",
        description:"Trendy and durable smartwatches "
    },
    {
        title:"Apple Watch Series 6",
        dec:"From ₹20,900 ",
        img:"/assets/watches/watch3.png",
        description:"Premium smartwatches with ECG monitoring"
    },
    {
        title: "Garmin Smartwatches",
        dec: "From ₹10,999",
        img: "/assets/watches/watch4.png",
        description: "High-performance smartwatches with GPS"
    },
]

export const HomeDresses1 = [
    {
        title: "Stylish Pants",
        desc: "From ₹1,299",
        img: "/assets/Dresses/men1.png"
    },
    {
        title: "Casual Shirts",
        desc: "Starting at ₹499",
        img: "/assets/Dresses/men2.png"
    },
    {
        title: "Designer Kurtas",
        desc: "Under ₹1,199",
        img: "/assets/Dresses/kurta.png"
    },
    {
        title: "Fun T-Shirts",
        desc: "Starting at ₹299",
        img: "/assets/Dresses/child2.png"
    },
];

export const HomeDresses2=[
    {
        title: "Trendy Gowns",
        desc: "Under ₹699",
        img: "/assets/Dresses/women1.png"
    },
    {
        title: "Top Dresses",
        desc: "Starting at ₹999",
        img: "/assets/Dresses/women2.png"
    },
    {
        title: "Cute Dresses",
        desc: "From ₹499",
        img: "/assets/Dresses/child1.png"
    },
    {
        title: "Traditional Sarees",
        desc: "Starting at ₹1,499",
        img: "/assets/Dresses/saree.png"
    },
]
export const HomeBuds = [
    {
        title: "Crystal Sound Headphones",
        desc: "Crystal Headphones deliver a stylish design",
        img: "/assets/Headphones/headphones2.png"
    },
    {
        title: "Echo Wave Buds",
        desc: "Immerse yourself in rich, deep bass",
        img: "/assets/Headphones/buds2.png"
    },
    {
        title: "Harmony Buds",
        desc: "Enjoy crystal clear audio and seamless",
        img: "/assets/Headphones/buds3.png"
    },
    {
        title: "Aurora Earphones",
        desc: "Sleek design meets powerful sound",
        img: "/assets/Headphones/earphones1.png"
    },
    {
        title: "Zenith Earphones",
        desc: "Zenith Earphones offer noise cancellation",
        img: "/assets/Headphones/earphones2.png"
    },
    {
        title: "Sonic Pulse Buds",
        desc: "Experience unmatched sound",
        img: "/assets/Headphones/buds1.png"
    },
];

export const HomeNewItems1 = [
    {
        title: "Eco Bottle",
        desc: "50% off",
        img: "/assets/Shoes/bottle1.png"
    },
    {
        title: "Face Wash",
        desc: "Glowing skin",
        img: "/assets/Shoes/normal.png"
    },
];

export const HomeNewItems2 = [
    {
        title: "Running Shoe",
        desc: "Just In",
        img: "/assets/Shoes/shoe.png"
    },
    {
        title: "Casual Slides",
        desc: "Summer Sale",
        img: "/assets/Shoes/slides.png"
    }
];

export const ItemImgs=[
    "/assets/watches/watch.png",
    "/assets/watches/dress.png"
]

export const searchCats=[
    {
        label:"Watches",
        link:"watches"
    },
    {
        label:"Mens Wear",
        link:"mens wear"
    },
    {
        label:"womens wear",
        link:"womens wear"
    },
    {
        label:"Shoes",
        link:"shoes"
    },
]
