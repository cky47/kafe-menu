const GOOGLE_MENU_API = "https://script.google.com/macros/s/AKfycbzjnglJzykueGVEolHgYscNYZWaA8h7aw0WWq4EqHPAZaQaOHqXlPDA9Ri8mdgUPo0Czg/exec";

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
            description: "Espresso, sıcak süt ve süt köpüğü.",
            price: 150,
            image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: "cappuccino",
            name: "Cappuccino",
            description: "Yoğun espresso, sıcak süt ve bol süt köpüğü.",
            price: 140,
            image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=500&q=80"
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
            image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=500&q=80"
        }
    ],

    soguk_icecekler: [],
    tatlilar: [],
    kahvaltilar: [],
    yiyecekler: [],
    diger: []
}

};

let menuData = JSON.parse(JSON.stringify(defaultMenuData));

async function loadMenuFromGoogle() {
try {
const response = await fetch(GOOGLE_MENU_API, {
method: "GET",
cache: "no-store"
});

    if (!response.ok) {
        throw new Error("Google bağlantısı başarısız.");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Geçersiz Google menü verisi.");
    }

    if (data.length === 0) {
        console.log("Google Sheet boş. Varsayılan menü kullanılıyor.");
        return null;
    }

    const googleMenu = {
        categories: JSON.parse(JSON.stringify(defaultMenuData.categories)),
        products: {}
    };

    googleMenu.categories.forEach(function(category) {
        googleMenu.products[category.id] = [];
    });

    data.forEach(function(item) {
        if (!item.category) {
            return;
        }

        const categoryId = String(item.category).trim();

        if (!googleMenu.products[categoryId]) {
            googleMenu.products[categoryId] = [];

            googleMenu.categories.push({
                id: categoryId,
                name: categoryId,
                icon: "🍽️"
            });
        }

        googleMenu.products[categoryId].push({
            id: item.productId || Date.now().toString(),
            name: item.name || "",
            description: item.description || "",
            price: Number(item.price) || 0,
            image: item.image || ""
        });
    });

    return googleMenu;

} catch (error) {
    console.error("Google menüsü alınamadı:", error);
    return null;
}

}

async function initializeMenu() {
const googleMenu = await loadMenuFromGoogle();

if (googleMenu) {
    menuData = googleMenu;
}

if (typeof renderMenu === "function") {
    renderMenu();
}

if (typeof showCategories === "function") {
    showCategories();
}

console.log("Menü hazır.");

}

initializeMenu();

async function saveMenuData() {
try {
const rows = [];

    menuData.categories.forEach(function(category) {
        const products = menuData.products[category.id] || [];

        if (products.length === 0) {
            rows.push({
                category: category.id,
                productId: "",
                name: "",
                description: "",
                price: "",
                image: ""
            });

            return;
        }

        products.forEach(function(product) {
            rows.push({
                category: category.id,
                productId: product.id || "",
                name: product.name || "",
                description: product.description || "",
                price: product.price || 0,
                image: product.image || ""
            });
        });
    });

    const response = await fetch(GOOGLE_MENU_API, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(rows)
    });

    if (!response.ok) {
        throw new Error("Google kayıt bağlantısı başarısız.");
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.error || "Menü kaydedilemedi."
        );
    }

    console.log("Menü Google Sheets'e başarıyla kaydedildi.");

    return true;

} catch (error) {
    console.error("Menü kaydetme hatası:", error);

    alert(
        "Menü kaydedilemedi.\n\n" +
        "Google Apps Script bağlantısını kontrol et."
    );

    return false;
}

}
