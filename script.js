const GOOGLE_MENU_API =
"https://script.google.com/macros/s/AKfycbz5bfWz50_hUmHYZgIBllpeHAvWnceLkNJ81EPYga9z0qNHJ-T5zEDDksbZEdrrianGhw/exec";

// ========================================
// MELITTA COFFEE - VARSAYILAN MENÜ
// ========================================

const defaultMenuData = {

```
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
            price: 150
        },

        {
            id: "cappuccino",
            name: "Cappuccino",
            description:
                "Yoğun espresso, sıcak süt ve bol süt köpüğü.",
            price: 140
        },

        {
            id: "americano",
            name: "Americano",
            description:
                "Espresso ve sıcak su ile hazırlanan klasik kahve.",
            price: 120
        },

        {
            id: "espresso",
            name: "Espresso",
            description:
                "Yoğun aromalı klasik espresso.",
            price: 100
        }

    ],

    soguk_icecekler: [],
    tatlilar: [],
    kahvaltilar: [],
    yiyecekler: [],
    diger: []

}
```

};

// ========================================
// MENÜYÜ GOOGLE SHEETS'TEN AL
// ========================================

async function loadMenuFromGoogle() {

```
try {

    const response =
        await fetch(GOOGLE_MENU_API);

    if (!response.ok) {

        throw new Error(
            "Google menü bağlantısı başarısız."
        );

    }

    const data =
        await response.json();

    if (!Array.isArray(data)) {

        throw new Error(
            "Google'dan geçersiz menü verisi geldi."
        );

    }

    const menuData = {

        categories:
            defaultMenuData.categories,

        products: {

            kahveler: [],
            soguk_icecekler: [],
            tatlilar: [],
            kahvaltilar: [],
            yiyecekler: [],
            diger: []

        }

    };


    data.forEach(function(item) {

        if (
            !item.category ||
            !menuData.products[item.category]
        ) {

            return;

        }


        menuData.products[item.category].push({

            id:
                item.productId || "",

            name:
                item.name || "",

            description:
                item.description || "",

            price:
                Number(item.price) || 0

        });

    });


    return menuData;

} catch (error) {

    console.error(
        "Google menü alınamadı:",
        error
    );

    return null;

}
```

}

// ========================================
// MENÜ VERİSİNİ HAZIRLA
// ========================================

let menuData =
defaultMenuData;

// ========================================
// GOOGLE MENÜSÜNÜ YÜKLE
// ========================================

loadMenuFromGoogle()
.then(function(googleMenu) {

```
    if (googleMenu) {

        menuData =
            googleMenu;

        console.log(
            "Google menüsü başarıyla yüklendi."
        );


        // Sayfada menü zaten çizilmişse
        // tekrar çiz

        if (
            typeof renderMenu === "function"
        ) {

            renderMenu();

        }

    }

});
```

// ========================================
// MENÜYÜ KAYDET
// ========================================

async function saveMenuData() {

```
try {

    const rows = [];


    menuData.categories.forEach(
        function(category) {

            const products =
                menuData.products[
                    category.id
                ] || [];


            products.forEach(
                function(product) {

                    rows.push({

                        category:
                            category.id,

                        productId:
                            product.id,

                        name:
                            product.name,

                        description:
                            product.description,

                        price:
                            product.price

                    });

                }
            );

        }
    );


    const response =
        await fetch(
            GOOGLE_MENU_API,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(rows)

            }
        );


    const result =
        await response.json();


    if (!result.success) {

        throw new Error(
            result.error ||
            "Menü kaydedilemedi."
        );

    }


    console.log(
        "Menü Google Sheets'e kaydedildi."
    );


    return true;


} catch (error) {

    console.error(
        "Menü kaydetme hatası:",
        error
    );

    alert(
        "Menü Google Sheets'e kaydedilemedi."
    );

    return false;

}
```

}
