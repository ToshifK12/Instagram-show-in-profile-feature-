# Show in Profile

A feature concept for Instagram Reels: one tap takes you from a reel to its exact spot in the creator's profile grid, so "Part 2" is right next to it.

**Live demo:** https://toshifk12.github.io/Instagram-show-in-profile-feature-/

**Demo video:** [demo.mp4](demo.mp4)

> This is an independent concept project. It is not affiliated with Instagram or Meta, and uses no Instagram code, logos, or assets.

## The problem

A reel ends with "Part 2 is on my profile." The profile opens at the newest post, so the viewer has to scroll through the whole grid to find the series. If the series is old, that can mean dozens of posts, and many people give up.

## The current fix and its gap

Instagram rolled out **Link a Reel** in August 2025: a creator can link one reel to another, and viewers get a "Watch Part 2" button. It only works when the creator sets it up, one link per reel. Older series, and creators who never use the feature, stay unlinked.

## The idea

Add a **Show in profile** button to every reel.

1. Viewer taps **Show in profile**.
2. The profile opens scrolled to that exact reel, with a highlight ring.
3. Parts of a series are usually posted back to back, so Part 2 is the next tile over.

It needs nothing from creators, so it works on every reel, old or new.

## How it would work at scale

The interesting part is loading a profile grid from the middle instead of from the top.

**API.** One new parameter on the profile feed endpoint:

```
GET /users/{userId}/posts?around={postId}&before=12&after=12
```

It returns the target post, 12 newer posts, 12 older posts, and a cursor for each direction.

**Database.** With posts indexed on `(user_id, created_at, post_id)`, two range queries do the work:

- Newer: `created_at > target`, ascending, limit 12
- Older: `created_at < target`, descending, limit 12

Both are index seeks, so the cost is the same for post 5 or post 5,000.

**Client.** Render the window, scroll the target tile to the center, and page in both directions as the user scrolls (bidirectional infinite scroll). Reserve placeholder rows above the window so the scroll position does not jump.

**Edge cases.**

| Case | Handling |
| --- | --- |
| Pinned posts | They sit out of date order, so skip them when building the window |
| Deleted or archived reel | Fall back to the top of the profile with a short notice |
| Private account | Show the button only to approved followers |
| Parts posted far apart | The jump still helps, and pairs with Link a Reel when set up |

## What's in this repo

| File | What it is |
| --- | --- |
| `index.html`, `style.css`, `app.js` | The clickable prototype. Plain HTML, CSS, and JavaScript, no build step |
| `demo.mp4` | A 30-second animated walkthrough |

The prototype keeps all posts in memory, so the "jump" is a client-side scroll. The API design above describes how a real implementation would fetch only the window it needs.

## Run it

Open `index.html` in a browser. No install needed.

## Author

Toshif Khan, B.S. Computer Science, Minot State University (Class of 2027)
