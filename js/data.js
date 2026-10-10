
// ChopSmart sample vendor data
// These are fictional vendors created for the synthesis project.

const vendors = [
    {
        id: 1,
        name: "Mama Ama's Kitchen",
        category: "Local Dishes",
        description: "Authentic Ghanaian favorites made with love.",
        emoji: "🍲",
        image: "images/waakye.jpg",
        color: "#ffe0c2",
        popular: "Waakye, Banku, Fufu",
        startingPrice: 25
    },
    {
        id: 2,
        name: "Jollof Junction",
        category: "Rice Meals",
        description: "Your go-to destination for delicious rice meals.",
        emoji: "🍛",
        image: "images/jollof-chicken.jpg",
        color: "#ffd5b5",
        popular: "Jollof Rice, Fried Rice",
        startingPrice: 30
    },
    {
        id: 3,
        name: "Campus Crunch",
        category: "Snacks",
        description: "Quick bites to keep you energized between classes.",
        emoji: "🥟",
        image: "images/meat-pie.jpg",
        color: "#ffedbd",
        popular: "Meat Pie, Kelewele, Spring Rolls",
        startingPrice: 10
    },
    {
        id: 4,
        name: "Green Bowl",
        category: "Healthy Meals",
        description: "Fresh and balanced meals for healthier eating.",
        emoji: "🥗",
        image: "images/chicken-salad.jpg",
        color: "#d8f0d5",
        popular: "Salads, Fruit Bowls, Wraps",
        startingPrice: 20
    },
    {
        id: 5,
        name: "The Rice Spot",
        category: "Rice Meals",
        description: "Affordable rice dishes for busy students.",
        emoji: "🍚",
        image: "images/plain-rice.jpg",
        color: "#ffe4c9",
        popular: "Waakye, Jollof, Plain Rice",
        startingPrice: 25
    },
    {
        id: 6,
        name: "Snack Haven",
        category: "Snacks",
        description: "Sweet and savory snacks for every craving.",
        emoji: "🍌",
        image: "images/kelewele.jpg",
        color: "#ffdfac",
        popular: "Kelewele, Doughnuts, Sobolo",
        startingPrice: 8
    }
];

const meals = [
    {
        id: 1,
        vendorId: 1,
        name: "Waakye & Egg",
        category: "Local Dishes",
        price: 30,
        emoji: "🍲",
        image: "images/waakye.jpg",
        description: "Traditional waakye served with egg and tasty accompaniments."
    },
    {
        id: 2,
        vendorId: 1,
        name: "Banku & Tilapia",
        category: "Local Dishes",
        price: 65,
        emoji: "🐟",
        image: "images/banku-tilapia.jpg",
        description: "Fresh tilapia with banku and spicy pepper sauce."
    },
    {
        id: 3,
        vendorId: 1,
        name: "Fufu & Light Soup",
        category: "Local Dishes",
        price: 50,
        emoji: "🥣",
        image: "images/fufu.jpg",
        description: "Soft fufu served with delicious Ghanaian light soup."
    },
    {
        id: 4,
        vendorId: 2,
        name: "Jollof Rice & Chicken",
        category: "Rice Meals",
        price: 45,
        emoji: "🍛",
        image: "images/jollof-chicken.jpg",
        description: "Flavorful jollof rice served with seasoned chicken."
    },
    {
        id: 5,
        vendorId: 2,
        name: "Fried Rice & Chicken",
        category: "Rice Meals",
        price: 50,
        emoji: "🍚",
        image: "images/fried-rice.jpg",
        description: "Delicious fried rice with chicken and vegetables."
    },
    {
        id: 6,
        vendorId: 3,
        name: "Meat Pie",
        category: "Snacks",
        price: 12,
        emoji: "🥟",
        image: "images/meat-pie.jpg",
        description: "Freshly baked pastry filled with seasoned meat."
    },
    {
        id: 7,
        vendorId: 3,
        name: "Kelewele & Groundnuts",
        category: "Snacks",
        price: 20,
        emoji: "🍌",
        image: "images/kelewele.jpg",
        description: "Spicy fried plantain served with roasted groundnuts."
    },
    {
        id: 8,
        vendorId: 4,
        name: "Chicken Salad",
        category: "Healthy Meals",
        price: 35,
        emoji: "🥗",
        image: "images/chicken-salad.jpg",
        description: "Fresh vegetables topped with grilled chicken."
    },
    {
        id: 9,
        vendorId: 4,
        name: "Fruit Bowl",
        category: "Healthy Meals",
        price: 20,
        emoji: "🍓",
        image: "images/fruit-bowl.jpg",
        description: "A refreshing combination of seasonal fruits."
    },
    {
        id: 10,
        vendorId: 5,
        name: "Jollof Rice",
        category: "Rice Meals",
        price: 30,
        emoji: "🍛",
        image: "images/jollof-rice.jpg",
        description: "A satisfying plate of Ghanaian jollof rice."
    },
    {
        id: 11,
        vendorId: 5,
        name: "Plain Rice & Stew",
        category: "Rice Meals",
        price: 25,
        emoji: "🍚",
        image: "images/plain-rice.jpg",
        description: "Steamed rice served with rich tomato stew."
    },
    {
        id: 12,
        vendorId: 6,
        name: "Sobolo",
        category: "Snacks",
        price: 10,
        emoji: "🥤",
        image: "images/sobolo.jpg",
        description: "Refreshing chilled hibiscus drink."
    },
    {
        id: 13,
        vendorId: 6,
        name: "Doughnuts",
        category: "Snacks",
        price: 8,
        emoji: "🍩",
        image: "images/doughnuts.jpg",
        description: "Freshly prepared sweet doughnuts."
    }
];
