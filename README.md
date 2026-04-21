# Flair Tagging

**2026 Ship-athon** | Scope: Fandom-wide

## Overview

Flair Tagging automatically categorizes user-generated posts by detecting keywords and assigning content flairs (e.g., *Fanfic*, *Poll*, *Meme*, *Trading Hack*, *Puzzle*). Fans can then filter their feed by flair to surface the content they care about most — driving repeat engagement and increasing MAUs.

## Problem

Users post for very specific reasons, but the feed treats all content the same. Fans who only want memes have to scroll past fanfic; puzzle solvers miss trading discussions. This friction reduces return visits.

## Solution

1. **Keyword detection** — Scan post content at publish time to identify content category signals.
2. **Flair assignment** — Tag each post with one or more flairs based on detected signals.
3. **Filter UI** — Surface flair pills on discussion/comment board so users can click to filter the feed to their preferred content type.

The result: a more personalized, serotonin-fueled browsing loop that brings fans back.

## User Flow

1. A user publishes a post.
2. The flair tagging service detects keywords and assigns a flair (e.g., `fanfic`, `poll`, `meme`).
3. The post appears in the feed with a visible flair badge.
4. Other users click a flair pill to filter the feed — seeing only the content category they want to read or react to.

## Goals

- Increase MAUs by making it easier for fans to find content they enjoy.
- Leverage existing UGC without requiring users to manually tag their own posts.
- Associate positive, repeat-engagement emotions with the Fandom platform.

## Scope

- **Platform**: Fandom-wide (all wikis/communities), POC limited to one wiki
- **Content types targeted**: fanfic, polls, trading hacks, puzzle-solving stories, memes, and more
- **Interaction**: Click-to-filter on flair pills in the post feed
