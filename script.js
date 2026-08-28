const GOOGLE_MENU_API =
"https://script.google.com/macros/s/AKfycbzjnglJzykueGVEolHgYscNYZWaA8h7aw0WWq4EqHPAZaQaOHqXlPDA9Ri8mdgUPo0Czg/exec";

const defaultCategories = [
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
];

const defaultProducts = {
kahveler: [
{
id: "latte",
name: "Latte",
description: "Espresso, sıcak süt ve süt köpüğü.",
price: 150,
image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=500&q=80"
}
],
soguk_icecekler: [],
tatlilar: [],
kahvaltilar: [],
yiyecekler: [],
diger: []
};

let menuData = {
categories: JSON.parse(JSON.stringify(defaultCategories)),
products: JSON.parse(JSON.stringify(defaultProducts))
};

async function loadMenuFromGoogle() {
try {
const response = await fetch(
GOOGLE_MENU_API + "?t=" + Date.now(),
{
method: "GET",
cache: "no-store"
}
);

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || "Google menüsü alınamadı.");
    }

    const categories = data.categories.length
        ? data.categories
        : JSON.parse(JSON.stringify(defaultCategories));

    const products = {};

    categories.forEach(function(category) {
        products[category.id] = [];
    });

    data.products.forEach(function(product) {
        if (!products[product.category]) {
            products[product.category] = [];
        }

        products[product.category].push({
            id: product.productId || "",
            name: product.name || "",
            description: product.description || "",
            price: Number(product.price) || 0,
            image: product.image || ""
        });
    });

    return {
        categories: categories,
        products: products
    };

} catch (error) {
    console.error("Google menüsü alınamadı:", error);
    return null;
}

}

async function saveMenuData() {
try {
const products = [];

    menuData.categories.forEach(function(category) {
        const categoryProducts =
            menuData.products[category.id] || [];

        categoryProducts.forEach(function(product) {
            products.push({
                category: category.id,
                productId: product.id || "",
                name: product.name || "",
                description: product.description || "",
                price: product.price || 0,
                image: product.image || ""
            });
        });
    });

    const categories =
        menuData.categories.map(function(category) {
            return {
                id: category.id,
                name: category.name,
                icon: category.icon
            };
        });

    const response = await fetch(
        GOOGLE_MENU_API,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                categories: categories,
                products: products
            })
        }
    );

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.error || "Google kayıt işlemi başarısız."
        );
    }

    return true;

} catch (error) {
    console.error("Kaydetme hatası:", error);

    alert(
        "Menü kaydedilemedi.\n\n" +
        error.message
    );

    return false;
}

}

async function initializeMenu() {
const googleMenu =
await loadMenuFromGoogle();

if (googleMenu) {
    menuData = googleMenu;
}

if (typeof showCategories === "function") {
    showCategories();
}

if (typeof renderMenu === "function") {
    renderMenu();
}

}

initializeMenu();
