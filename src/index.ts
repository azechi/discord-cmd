addEventListener('fetch', (e: FetchEvent) =>{
	e.respondWith(handleRequest(e.request));
});

declare const PUBLIC_KEY: string;

async function handleRequest(req: Request) {

	console.log(PUBLIC_KEY);


	return new Response("Hello, Workers!?")
}


