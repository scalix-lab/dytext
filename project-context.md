# DyText - Dynamic Text Management Library

## Project Overview
NPM library for text and content management in static websites (like Strapi or Contentful alternative).

## Development Approach - TDD Driven Development

### Phase 1: Foundation (Current)
1. **Empty Skeleton Package** - Create and publish empty NPM package as foundation
2. **TDD Setup** - Establish test-driven development workflow
3. **Backend Development** - Implement API backend for content delivery

### Phase 2: Core Implementation
4. **Test Suite** - Implement comprehensive tests for basic features
5. **Multi-Framework Support** - Initialize to support:
   - Next.js
   - React
   - Vue
   - Vanilla JS
6. **Environment Configuration** - Support initialization via:
   - Direct token parameter
   - Environment variables (`DYTEXT_TOKEN`)

### Phase 3: Core Functionality - Pure `get()` Function
The `get()` function follows this resolver pattern:

1. **Node Resolution** - Check if requested node exists in cache using dotted path
2. **Cache Hit** - If exists, return value from cache
3. **Cache Miss** - Call API to fetch parent level node
4. **Deep Merge** - Update cache state with new data using deep merge
5. **Version Control** - Use `head_commit_id` from response to:
   - Track data version on backend
   - Compare versions to detect updates
   - Clear cache when new data is available
6. **Return Value** - Extract and return requested value from updated cache

## Architecture Principles
- **Pure Functions** - All core functions should be pure and predictable
- **Caching First** - Cache-first approach with intelligent invalidation
- **Version Aware** - Backend version tracking for cache management
- **Framework Agnostic** - Support multiple frontend frameworks

## Current Status
- Phase 1: Creating empty skeleton and removing complex logic
- Next: TDD setup and backend implementation 