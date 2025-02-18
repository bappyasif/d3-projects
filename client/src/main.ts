import {createTRPCProxyClient, httpBatchLink} from "@trpc/client"

import {AppRouter} from "../../server/index.ts"


const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3001/trpc"
        })
    ]
})

const main = async () => {
    /**
     * as we used httpBatchLink, we can multiple requests at once and it will be batched, as in count as one call and returned values will be sent back in an array of results
     * 
     * 
     * e.g lets call this multiple times and will see that in network tab we will see only one request with response back from server with their responses
     * 
     * ```ts
     * await client.sayHi.query()
     * await client.sayHi.query()
     * await client.sayHi.query()
     * await client.sayHi.query()
     * ```
     */
    const result = await client.sayHi.query()
    console.log(result);

    // type safety is now included thanks to trpc client
    const mutationResult = await client.logToServer.mutate("hiiii")
    console.log(mutationResult);

    // this will fail as type is not string
    // await client.logToServer.mutate(2)

    // this will fail as procedure is not defined or does not exist
    // await client.log.mutate("hiiii")

    // making use of nested routers defined in server side
    const user = await client.users.getUser.query() // this still works as im keeping it there to show how to use nested routers
    console.log(user);

    // making use of merged routers defined in server side
    const mergedResult = await client.getUser.query() // as you can see its no longer nested within root router
    console.log(mergedResult);
}

main()
// console.log("hello world");