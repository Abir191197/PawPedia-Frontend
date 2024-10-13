"use client"

import React from 'react'
import CompactEditor from './CreatePost';
import PostView from './PostView';
import FollowersAndFollowing from './Followers';

export default function MainPostArea() {
  return (
    <main className="-mt-24 pb-8 bg-yellow-100 scroll-smooth h-full">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">Profile</h1>
        <div className="pb-10 pt-10"></div>
        {/* Main 3 column grid */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Left column */}

          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <CompactEditor />
            <section aria-labelledby="section-1-title">
              <h2 className="sr-only" id="section-1-title">
                Section title
              </h2>
              <div className="">
                <div className="p-6 ">
                  <PostView />
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4">
            <section aria-labelledby="section-2-title">
              <h2 className="sr-only" id="section-2-title">
                Followers
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h1 className="text-2xl font-bold"></h1>
                  <FollowersAndFollowing />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
