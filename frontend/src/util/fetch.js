async function fetchData(url, path, method, body, value, setValue) {
    const res = await fetch(url + path, {
        method: method,
        body: JSON.stringify(...body)
    });

    try {
        const data = await res.json();
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

export {fetchData}