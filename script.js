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

    const categories = JSON.parse(
        JSON.stringify(defaultMenuData.categories)
    );

    const products = {};

    categories.forEach(function(category) {
        products[category.id] = [];
    });

    const categoryMap = {};

    categories.forEach(function(category) {
        categoryMap[category.id] = category;
    });

    data.forEach(function(item) {

        if (item._categoryData) {

            const id = String(item.category || "").trim();

            if (!id) {
                return;
            }

            if (categoryMap[id]) {

                categoryMap[id].name =
                    item.categoryName ||
                    categoryMap[id].name;

                categoryMap[id].icon =
                    item.categoryIcon ||
                    categoryMap[id].icon;

            } else {

                const newCategory = {
                    id: id,
                    name: item.categoryName || id,
                    icon: item.categoryIcon || "🍽️"
                };

                categories.push(newCategory);

                categoryMap[id] = newCategory;

                products[id] = [];
            }

            return;
        }

        const categoryId =
            String(item.category || "").trim();

        if (!categoryId) {
            return;
        }

        if (!products[categoryId]) {

            products[categoryId] = [];

            const newCategory = {
                id: categoryId,
                name: categoryId,
                icon: "🍽️"
            };

            categories.push(newCategory);
            categoryMap[categoryId] = newCategory;
        }

        if (!item.name) {
            return;
        }

        products[categoryId].push({
            id: item.productId || Date.now().toString(),
            name: item.name || "",
            description: item.description || "",
            price: Number(item.price) || 0,
            image: item.image || ""
        });
    });

    return {
        categories: categories,
        products: products
    };

} catch (error) {

    console.error(
        "Google menüsü alınamadı:",
        error
    );

    return null;
}

}

async function initializeMenu() {

const googleMenu =
    await loadMenuFromGoogle();

if (googleMenu) {
    menuData = googleMenu;
}

if (typeof renderMenu === "function") {
    renderMenu();
}

if (typeof showCategories === "function") {
    showCategories();
}

}

initializeMenu();

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

    const payload = {
        categories: categories,
        products: products
    };

    const response =
        await fetch(GOOGLE_MENU_API, {
            method: "POST",
            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });

    if (!response.ok) {
        throw new Error(
            "Google kayıt bağlantısı başarısız."
        );
    }

    const result =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.error ||
            "Menü kaydedilemedi."
        );
    }

    console.log(
        "Menü başarıyla kaydedildi."
    );

    return true;

} catch (error) {

    console.error(
        "Menü kaydetme hatası:",
        error
    );

    alert(
        "Menü kaydedilemedi.\n\n" +
        error.message
    );

    return false;
}

}
