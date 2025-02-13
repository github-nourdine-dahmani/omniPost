
export async function fetchHeadlines() {

    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`)
    const data = await res.json();

    console.log(data);

    return data.articles;
}
