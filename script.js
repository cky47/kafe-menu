const GOOGLE_MENU_API =
"https://script.google.com/macros/s/AKfycbz5bfWz50_hUmHYZgIBllpeHAvWnceLkNJ81EPYga9z0qNHJ-T5zEDDksbZEdrrianGhw/exec";

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

let menuData = defaultMenuData;

async function loadMenuFromGoogle() {

```
try {

    const response =
        await fetch(GOOGLE_MENU_API);

    if (!response.ok) {

        throw new Error(
            "Google bağlantısı başarısız."
        );

    }

    const data =
        await response.json();


    if (!Array.isArray(data)) {

        throw new Error(
            "Geçersiz Google menü verisi."
        );

    }


    if (data.length === 0) {

        console.log(
            "Google Sheet boş. Varsayılan menü kullanılıyor."
        );

        return;

    }


    const googleMenu = {

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
            !googleMenu.products[item.category]
        ) {

            return;

        }


        googleMenu.products[
            item.category
        ].push({

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


    menuData = googleMenu;


    console.log(
        "Google menüsü başarıyla yüklendi."
    );


    if (
        typeof renderMenu === "function"
    ) {

        renderMenu();

    }


} catch (error) {

    console.error(
        "Google menüsü alınamadı:",
        error
    );

}
```

}

loadMenuFromGoogle();

async function saveMenuData() {

```
try {

    const rows = [];


    menuData.categories.forEach(
        function(category) {

            const categoryProducts =
                menuData.products[
                    category.id
                ] || [];


            categoryProducts.forEach(
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
}
