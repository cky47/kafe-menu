// ========================================
// MELITTA COFFEE - MENÜ VERİLERİ
// ========================================


// Varsayılan menü

const defaultMenuData = {

    categories: [

        {
            id: "kahveler",
            name: "Kahveler",
            icon: "☕"
        },

        {
            id: "soguk_icecekler",
            name: "Soğuk İçecekler",
            icon: "🧊"
        },

        {
            id: "tatlilar",
            name: "Tatlılar",
            icon: "🍰"
        },

        {
            id: "kahvaltilar",
            name: "Kahvaltılar",
            icon: "🍳"
        },

        {
            id: "yiyecekler",
            name: "Yiyecekler",
            icon: "🍔"
        },

        {
            id: "diger",
            name: "Diğer",
            icon: "🥤"
        }

    ],


    products: {

        kahveler: [

            {
                id: "latte",
                name: "Latte",
                description:
                    "Espresso, sıcak süt ve süt köpüğü.",
                price: 150,
                image:
                    "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=500&q=80"
            },


            {
                id: "cappuccino",
                name: "Cappuccino",
                description:
                    "Yoğun espresso, sıcak süt ve bol süt köpüğü.",
                price: 140,
                image:
                    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80"
            },


            {
                id: "americano",
                name: "Americano",
                description:
                    "Espresso ve sıcak su ile hazırlanan klasik kahve.",
                price: 120,
                image:
                    "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=500&q=80"
            },


            {
                id: "espresso",
                name: "Espresso",
                description:
                    "Yoğun aromalı klasik espresso.",
                price: 100,
                image:
                    "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80"
            }

        ],


        soguk_icecekler: [],

        tatlilar: [],

        kahvaltilar: [],

        yiyecekler: [],

        diger: []

    }

};


// ========================================
// KAYITLI VERİYİ AL
// ========================================

let menuData;


const savedData =
    localStorage.getItem("melittaCoffeeMenu");


if (savedData) {

    try {

        menuData =
            JSON.parse(savedData);

    } catch (error) {

        console.log(
            "Kayıtlı veri okunamadı. Varsayılan menü kullanılıyor."
        );

        menuData =
            defaultMenuData;

    }

} else {

    menuData =
        defaultMenuData;

}


// ========================================
// MENÜYÜ KAYDET
// ========================================

function saveMenuData() {

    localStorage.setItem(
        "melittaCoffeeMenu",
        JSON.stringify(menuData)
    );

}