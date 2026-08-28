const GOOGLE_MENU_API = "https://script.google.com/macros/s/AKfycbzjnglJzykueGVEolHgYscNYZWaA8h7aw0WWq4EqHPAZaQaOHqXlPDA9Ri8mdgUPo0Czg/exec";

const menuData = {
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
            description: "Espresso, sıcak süt ve süt köpüğü.",
            price: 150,
            image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: "cappuccino",
            name: "Cappuccino",
            description: "Yoğun espresso, sıcak süt ve bol süt köpüğü.",
            price: 140,
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: "americano",
            name: "Americano",
            description: "Espresso ve sıcak su ile hazırlanan klasik kahve.",
            price: 120,
            image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: "espresso",
            name: "Espresso",
            description: "Yoğun aromalı klasik espresso.",
            price: 100,
            image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80"
        }
    ],

    soguk_icecekler: [],
    tatlilar: [],
    kahvaltilar: [],
    yiyecekler: [],
    diger: []
}

};

async function loadMenuFromGoogle() {
try {
const response = await fetch(GOOGLE_MENU_API);

    if (!response.ok) {
        throw new Error("Google bağlantısı başarısız.");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Geçersiz Google menü verisi.");
    }

    if (data.length === 0) {
        console.log("Google Sheet boş. Varsayılan menü kullanılacak.");
        return;
    }

    const newProducts = {
        kahveler: [],
        soguk_icecekler: [],
        tatlilar: [],
        kahvaltilar: [],
        yiyecekler: [],
        diger: []
    };

    data.forEach(function(item) {
        if (!item.category) {
            return;
        }

        if (!newProducts[item.category]) {
            return;
        }

        newProducts[item.category].push({
            id: item.productId || "",
            name: item.name || "",
            description: item.description || "",
            price: Number(item.price) || 0,
            image: item.image || ""
        });
    });

    menuData.products = newProducts;

    console.log("Google Sheets menüsü yüklendi.");

} catch (error) {
    console.error("Google menüsü alınamadı:", error);
}

}

loadMenuFromGoogle();
