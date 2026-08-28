const GOOGLE_MENU_API = "https://script.google.com/macros/s/AKfycbzjnglJzykueGVEolHgYscNYZWaA8h7aw0WWq4EqHPAZaQaOHqXlPDA9Ri8mdgUPo0Czg/exec";

let menuData = {
    categories: [],
    products: {}
};

async function loadMenuData() {
    try {
        const response = await fetch(
            GOOGLE_MENU_API + "?t=" + Date.now(),
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Google Apps Script bağlantısı kurulamadı.");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.error || "Menü verileri alınamadı."
            );
        }

        menuData.categories = [];
        menuData.products = {};

        if (Array.isArray(data.categories)) {

            data.categories.forEach(function(category) {

                const id = String(
                    category.id || category.category || ""
                );

                if (!id) {
                    return;
                }

                menuData.categories.push({
                    id: id,
                    name: String(category.name || ""),
                    icon: String(category.icon || "☕")
                });

                menuData.products[id] = [];
            });
        }

        if (Array.isArray(data.products)) {

            data.products.forEach(function(product) {

                const categoryId =
                    String(product.category || "");

                if (!categoryId) {
                    return;
                }

                if (!menuData.products[categoryId]) {
                    menuData.products[categoryId] = [];
                }

                menuData.products[categoryId].push({
                    id: String(product.productId || ""),
                    name: String(product.name || ""),
                    description: String(product.description || ""),
                    price: Number(product.price) || 0,
                    image: String(product.image || "")
                });
            });
        }

        return true;

    } catch (error) {

        console.error(
            "Menü yükleme hatası:",
            error
        );

        return false;
    }
}

async function saveMenuData() {

    try {

        const categories =
            menuData.categories.map(function(category) {

                return {
                    id: String(category.id),
                    name: String(category.name || ""),
                    icon: String(category.icon || "☕")
                };

            });

        const products = [];

        Object.keys(menuData.products).forEach(function(categoryId) {

            const categoryProducts =
                menuData.products[categoryId] || [];

            categoryProducts.forEach(function(product) {

                products.push({

                    category: String(categoryId),

                    productId:
                        String(product.id || ""),

                    name:
                        String(product.name || ""),

                    description:
                        String(product.description || ""),

                    price:
                        Number(product.price) || 0,

                    image:
                        String(product.image || "")
                });

            });

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

        if (!response.ok) {
            throw new Error(
                "Google Apps Script kayıt isteğini kabul etmedi."
            );
        }

        const result =
            await response.json();

        if (!result.success) {
            throw new Error(
                result.error ||
                "Google Sheets'e kayıt yapılamadı."
            );
        }

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

async function refreshMenuData() {

    const success =
        await loadMenuData();

    if (!success) {
        return false;
    }

    if (
        typeof showCategories ===
        "function"
    ) {
        showCategories();
    }

    if (
        typeof renderMenu ===
        "function"
    ) {
        renderMenu();
    }

    return true;
}

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        const success =
            await loadMenuData();

        if (!success) {

            console.error(
                "Menü verileri yüklenemedi."
            );

            return;
        }

        if (
            typeof showCategories ===
            "function"
        ) {
            showCategories();
        }

        if (
            typeof renderMenu ===
            "function"
        ) {
            renderMenu();
        }
    }
);
