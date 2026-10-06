let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let mood = 'create';
let tmp;

function get_total() {

    if (price.value != '') {

        let result =
            (+price.value +
            +taxes.value +
            +ads.value) -
            +discount.value;

        total.innerHTML = result;

        total.style.background = '#040';

    } else {

        total.innerHTML = '';

        total.style.background = 'rgb(2, 82, 82)';

    }

}

let datapro;

if (localStorage.product != null) {

    datapro = JSON.parse(localStorage.product);

} else {

    datapro = [];

}

submit.onclick = function () {

    let productTitle = title.value.trim();
    let productCategory = category.value.trim();

    if (productTitle == '') {

        alert('Please enter the title');

        title.focus();

        return;

    }

    if (
        price.value == '' ||
        Number(price.value) < 0
    ) {

        alert('Please enter a valid price');

        price.focus();

        return;

    }

    if (
        taxes.value == '' ||
        Number(taxes.value) < 0
    ) {

        alert('Please enter valid taxes');

        taxes.focus();

        return;

    }

    if (
        ads.value == '' ||
        Number(ads.value) < 0
    ) {

        alert('Please enter valid ads');

        ads.focus();

        return;

    }

    if (
        discount.value == '' ||
        Number(discount.value) < 0
    ) {

        alert('Please enter valid discount');

        discount.focus();

        return;

    }

    if (
        Number(discount.value) >
        (
            Number(price.value) +
            Number(taxes.value) +
            Number(ads.value)
        )
    ) {

        alert('Discount cannot be greater than the total');

        discount.focus();

        return;

    }

    if (productCategory == '') {

        alert('Please enter the category');

        category.focus();

        return;

    }

    if (
        mood == 'create' &&
        (
            count.value == '' ||
            Number(count.value) < 1
        )
    ) {

        alert('Count must be at least 1');

        count.focus();

        return;

    }

    let newpro = {

        title: productTitle.toLowerCase(),

        price: price.value,

        taxes: taxes.value,

        ads: ads.value,

        discount: discount.value,

        total: total.innerHTML,

        count: count.value,

        category: productCategory.toLowerCase()

    };

    if (mood == 'create') {

        if (newpro.count > 1) {

            for (
                let i = 0;
                i < newpro.count;
                i++
            ) {

                datapro.push({
                    ...newpro
                });

            }

        } else {

            datapro.push(newpro);

        }

        clearData();

    } else {

        datapro[tmp] = newpro;

        mood = 'create';

        submit.innerHTML = 'Create';

        count.style.display = 'block';

        clearData();

    }

    localStorage.setItem(
        'product',
        JSON.stringify(datapro)
    );

    showdata();

};

function clearData() {

    title.value = '';

    price.value = '';

    taxes.value = '';

    ads.value = '';

    discount.value = '';

    total.innerHTML = '';

    total.style.background =
        'rgb(2, 82, 82)';

    count.value = '';

    category.value = '';

}

function showdata() {

    get_total();

    let table = '';

    for (
        let i = 0;
        i < datapro.length;
        i++
    ) {

        table += `

        <tr>

            <td>${i + 1}</td>

            <td>${datapro[i].title}</td>

            <td>${datapro[i].price}</td>

            <td>${datapro[i].taxes}</td>

            <td>${datapro[i].ads}</td>

            <td>${datapro[i].discount}</td>

            <td>${datapro[i].total}</td>

            <td>${datapro[i].category}</td>

            <td>

                <button
                    onclick="UpdateItem(${i})"
                    id="update"
                >
                    Update
                </button>

            </td>

            <td>

                <button
                    onclick="deleteItem(${i})"
                    id="delete"
                >
                    Delete
                </button>

            </td>

        </tr>

        `;

    }

    document.getElementById('tbody').innerHTML =
        table;

    let btndelete =
        document.getElementById('deleteAll');

    if (datapro.length > 0) {

        btndelete.innerHTML = `

            <button onclick="deleteData()">

                Delete All (${datapro.length})

            </button>

        `;

    } else {

        btndelete.innerHTML = '';

    }
    showTotals();

}

function deleteItem(i) {

    let confirmDelete =
        confirm(
            'Are you sure you want to delete this product?'
        );

    if (!confirmDelete) {

        return;

    }

    datapro.splice(i, 1);

    localStorage.setItem(
        'product',
        JSON.stringify(datapro)
    );

    showdata();

}

function deleteData() {

    let confirmDelete =
        confirm(
            `Are you sure you want to delete all ${datapro.length} products?`
        );

    if (!confirmDelete) {

        return;

    }

    datapro.splice(0);

    localStorage.removeItem('product');

    showdata();

}

function UpdateItem(i) {

    title.value =
        datapro[i].title;

    price.value =
        datapro[i].price;

    taxes.value =
        datapro[i].taxes;

    ads.value =
        datapro[i].ads;

    discount.value =
        datapro[i].discount;

    category.value =
        datapro[i].category;

    count.style.display = 'none';

    get_total();

    submit.innerHTML = 'Update';

    mood = 'update';

    tmp = i;

    scroll({

        top: 0,

        behavior: 'smooth'

    });

}

let searchBy = 'title';

function getsearch(id) {

    let search =
        document.getElementById('search');

    if (id == 'search-title') {

        searchBy = 'title';

        search.placeholder =
            'Search By Title';

    } else {

        searchBy = 'category';

        search.placeholder =
            'Search By Category';

    }

    search.focus();

    search.value = '';

    showdata();

}

function searchData(value) {

    let table = '';

    value = value.toLowerCase();

    if (searchBy == 'title') {

        for (
            let i = 0;
            i < datapro.length;
            i++
        ) {

            if (
                datapro[i].title.includes(value)
            ) {

                table += createRow(i);

            }

        }

    } else {

        for (
            let i = 0;
            i < datapro.length;
            i++
        ) {

            if (
                datapro[i].category.includes(value)
            ) {

                table += createRow(i);

            }

        }

    }

    document.getElementById('tbody').innerHTML =
        table;

}

function createRow(i) {

    return `

        <tr>

            <td>${i + 1}</td>

            <td>${datapro[i].title}</td>

            <td>${datapro[i].price}</td>

            <td>${datapro[i].taxes}</td>

            <td>${datapro[i].ads}</td>

            <td>${datapro[i].discount}</td>

            <td>${datapro[i].total}</td>

            <td>${datapro[i].category}</td>

            <td>

                <button
                    onclick="UpdateItem(${i})"
                    id="update"
                >
                    Update
                </button>

            </td>

            <td>

                <button
                    onclick="deleteItem(${i})"
                    id="delete"
                >
                    Delete
                </button>

            </td>

        </tr>

    `;

}
function showTotals() {

    let productsTotal =
        document.getElementById('productsTotal');

    let moneyTotal =
        document.getElementById('moneyTotal');

    let categoryTotals =
        document.getElementById('categoryTotals');


    let totalMoney = 0;

    let categories = {};


    for (let i = 0; i < datapro.length; i++) {

        let productTotal =
            Number(datapro[i].total);

        totalMoney += productTotal;


        let category =
            datapro[i].category;


        if (categories[category] == undefined) {

            categories[category] = 0;

        }

        categories[category] += productTotal;

    }


    productsTotal.innerHTML =
        datapro.length;


    moneyTotal.innerHTML =
        totalMoney;


    let result = '';


    for (let category in categories) {

        result += `

            <div class="category-box">

                <span>${category}</span>

                <strong>
                    ${categories[category]}
                </strong>

            </div>

        `;

    }


    categoryTotals.innerHTML = result;

}

showdata();
