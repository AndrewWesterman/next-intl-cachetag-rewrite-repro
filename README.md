## Description

This is a repo to reproduce what appears to be a bug with next-intl and Nextjs' cache key generation.

What appears to be happening is that revalidating a page appears to be changing the underlying cache key that Next uses to determine whether a page should be rerendered when using ISR.

This causes the cache key associated with the page to be unreliable and makes the subsequent revalidation requests for the same request not work.

## Build

```
npm i; npm run build; npm run start
```

## Repro

1. Build and run the site
2. Navigate to http://localhost:3000/
3. In dev tools open the 'Doc' response for 'localhost'
4. Observe the presence of a `X-Nextjs-Cache: HIT` header
5. Go to `~/.next/server/app/en-US.meta` in your IDE/file explorer
6. Obeserve a json object containing `x-next-cache-tags: "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/en-US"`
   1. Take note of the last cache key, which only revalidates this page specifically. This page being `/en-US` for clarity
7. Revalidate the page with the following
  ```
  curl "http://localhost:3000/api/revalidate?pathname=/en-US"
  ```
8. Refresh the home page in the browser
9. Observe the presence of a `X-Nextjs-Cache: MISS` header on the page response, indicating that Next rerendered the page on this request
10. Go to `~/.next/server/app/en-US.meta` in your IDE/file explorer
11. Obeserve a json object containing `x-next-cache-tags: "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/"`
    1.  Take note of the last cache key, **which has been changed after the page has rerendered**. This page's cache key is now `/` for clarity
12. Revalidate the page again with the same command from Step 7
13. Refresh the page again
14. Observe `X-Nextjs-Cache: HIT` on each subsequent page refresh, indicating that we can no longer revalidate the page with the original cache key.
    
You can confirm revalidation still works in general and this is merely a cache key problem by revalidating with
```
curl "http://localhost:3000/api/revalidate?pathname=/"
```
and observing that the `X-Nextjs-Cache` shows a `MISS` on each refresh after executing the command.

## Expected behavior

We should be able to revalidate with the resolved /[locale] cache tag - i.e. en-US, fr-FR, etc - and have the cache key in the .meta file associate with the built version of the site not change between renders.

## Debugging
You can also enable the `NEXT_PRIVATE_DEBUG_CACHE=1` flag in `~/.env` and Next will spit out its cache tag revalidation manifest in real time.