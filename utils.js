
export function debounce(fn, delay = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

export function filterUsers(users, filters) {
    const query = filters.search.toLowerCase();
    return users.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        return fullName.includes(query);
    });
}

export function sortUsers(users, sortType) {
    const sorted = [...users];
    switch (sortType) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.first.localeCompare(b.name.first));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.first.localeCompare(a.name.first));
        case 'age-asc':
            return sorted.sort((a, b) => a.dob.age - b.dob.age);
        case 'age-desc':
            return sorted.sort((a, b) => b.dob.age - a.dob.age);
        default:
            return users;
    }
}
