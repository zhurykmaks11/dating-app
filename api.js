const createCard = (elem) => ({
    name: elem.name,
    age: elem.age,
    image: elem.image
});

const dataService = (() => {
    const url = "https://randomuser.me/api/";

    const mapToCard = user => ({
        name: `${user.name.first} ${user.name.last}`,
        age: user.dob.age,
        image: user.picture.large
    });

    const mapArray = (array) => array.map(mapToCard);

    const getAllCards = (results = 30, page = 1) =>
        fetch(`${url}?results=${results}&page=${page}`).then(response => {
            if(!response.ok) throw new Error("Network response was not ok");
            return response.json();
        }).then(data => data.results.map(mapToCard));

    return {
        getAllCards
    }
})();