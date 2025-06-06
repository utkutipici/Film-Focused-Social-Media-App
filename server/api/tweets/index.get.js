import { getTweets } from "~~/server/db/tweets"
import { tweetTransformer } from "~~/server/transformers/tweet"
import { getQuery } from 'h3'  // Add this import

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    let primsaQuery = {
        include: {
            author: true,
            mediaFiles: true,
            replies: {
                include: {
                    author: true
                }
            },
            replyTo: {
                include: {
                    author: true
                }
            }
        },
        orderBy: [
            {
                createdAt: 'desc'
            }
        ]
    }

    if (query.query) {  // Changed from !!query to query.query
        primsaQuery = {
            ...primsaQuery,
            where: {
                text: {
                    contains: query.query
                }
            }
        }
    }

    const tweets = await getTweets(primsaQuery)

    return {
        tweets: tweets.map(tweetTransformer)
    }
})