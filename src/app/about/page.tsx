import Link from 'next/link';

export const metadata = {
  title: 'About | Nick Shirley',
  description: 'Learn more about Nick Shirley, an independent journalist who travels the world to report on current events.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="border-t-4 border-black pt-8 mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 font-headline">About Nick Shirley</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-serif italic">
              Nick Shirley. Twenty-three years old. Independent. And he's coming for the stories legacy media refuses to touch.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content Column */}
        <div className="lg:col-span-8 prose prose-base max-w-none font-serif">
          <p className="text-base leading-relaxed mb-8 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
            Nick Shirley is the independent journalist and YouTube creator delivering unfiltered, street-level truth that shatters narratives and exposes corruption. With a massive reach of over 1 million subscribers on YouTube and 372,000 followers on X, Shirley has built an army of supporters hungry for accountability—and he’s forcing the issues into the national spotlight.
          </p>

          <p className="text-base leading-relaxed mb-8">
            His mission is simple: go directly to the source, ask the uncomfortable questions, and let the facts fall where they may. No gatekeepers. No corporate filters. No spin.
          </p>

          <div className="border-t border-gray-200 my-12 w-32"></div>

          <h2 className="text-xl font-bold mb-4 font-headline">The Ground Game: Uncovering the Impossible</h2>
          <p className="text-base leading-relaxed mb-6">
            Shirley's brand of journalism happens on the front lines. He doesn't wait for press conferences; he walks into the fire. This is a journalist who confronted New York City officials about migrant crisis scams, documented empty childcare facilities in Minnesota that billed taxpayers OVER $110 MILLION IN ONE DAY, and even walked through El Salvador's notorious CECOT mega-prison.
          </p>
          <p className="text-base leading-relaxed mb-6">
            He films inside subway cars where violence has exploded, stands face-to-face with protesters, and puts cameras on politicians who have nowhere to hide. His gotcha questions have become viral moments—showing what honesty looks like when questions go unanswered.
          </p>
          <p className="text-base leading-relaxed mb-6">
            But it's not about comfort. It's about exposure.
          </p>
          <p className="text-base leading-relaxed mb-6">
            During protests in Portland, he was once threatened at gunpoint. He didn't back down. He kept reporting. That's the toughness required when you're on the ground while other journalists are still typing.
          </p>

          <h2 className="text-xl font-bold mt-12 mb-4 font-headline">The Viral Breakthrough: Stumbling Onto a Massive Scandal</h2>
          <p className="text-base leading-relaxed mb-6">
            Shirley's reporting exploded in late 2025 with one investigation that broke the internet: the Minnesota childcare fraud scandal.
          </p>
          <p className="text-base leading-relaxed mb-6">
            In a bombshell 42-minute video posted December 26, 2025, he and his crew exposed what is arguably one of the largest taxpayer heists in modern history. They drove to childcare centers allegedly serving hundreds of children—facilities that billed the state millions—only to find empty buildings, locked doors, and overgrown playgrounds.
          </p>
          <p className="text-base leading-relaxed mb-6">
            They confronted owners who couldn't explain WHERE THE CHILDREN WERE. They found facilities operating out of condemned buildings. They documented state payments flowing to addresses that were clearly fraudulent.
          </p>
          <p className="text-base leading-relaxed mb-6">
            The reaction was electric.
          </p>
          <p className="text-base leading-relaxed mb-6">
            The video pulled in millions of views across platforms. Elon Musk amplified it. Andrew Tate called for arrests. Jack Posobiec demanded the prosecution of Minnesota Gov. Tim Walz for his alleged role in enabling the scheme. The story became a firestorm that even Democrats had to address.
          </p>
          <p className="text-base leading-relaxed mb-6">
            For Shirley, it proved his core argument: The real stories are hiding in plain sight. You just have to go look.
          </p>

          <h2 className="text-xl font-bold mt-12 mb-4 font-headline">The Origins: From Pranks to Accountability</h2>
          <p className="text-base leading-relaxed mb-6">
            Before he was a journalist, Shirley started as a teenager making prank and entertainment videos around 2017–2019. It was raw, unfiltered content—the kind that built a loyal following. But as the world changed, so did his focus. He saw stories no one was covering. Gaps in the narrative that needed filling.
          </p>
          <p className="text-base leading-relaxed mb-6">
            By 2024, he pivoted to harder topics: immigration, urban crime, the border crisis, and protests. His videos took him from NYC subways to deep inside pro-Palestine demonstrations, interviewing North Korean defectors about socialism's failures and challenging protesters on their own talking points.
          </p>
          <p className="text-base leading-relaxed mb-6">
            The evolution from entertainment to accountability journalism wasn't an accident. It was a choice to use his platform for something that matters.
          </p>

          <h2 className="text-xl font-bold mt-12 mb-4 font-headline">The Mainstream Pushback and the National Spotlight</h2>
          <p className="text-base leading-relaxed mb-6">
            When your work exposes powerful people, backlash is inevitable. Shirley has faced accusations of bias, sensationalism, and selective editing—often from the very activists and politicians he holds accountable.
          </p>
          <p className="text-base leading-relaxed mb-6">
            But silence isn't accountability.
          </p>
          <p className="text-base leading-relaxed mb-6">
            He's appeared on Fox News programs like <em>Jesse Watters Primetime</em> and <em>The Ingraham Angle</em>, Timcast IRL, and even C-SPAN to defend his reporting. These outlets recognize what he brings: ground-level reality that challenges the status quo.
          </p>
          <p className="text-base leading-relaxed mb-6">
            His critics can complain about his methods. They can't refute his cameras.
          </p>

          <h2 className="text-xl font-bold mt-12 mb-4 font-headline">Topics That Won't Be Ignored</h2>
          <p className="text-base leading-relaxed mb-6">
            Shirley's reporting spans the issues Americans are desperate to understand—the ones legacy media sweeps under the rug.
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-8 text-base">
            <li><strong>The Migrant Crisis:</strong> From New York City to Ireland, he exposes the costs, the scams, and the strains on communities. No one else is this direct about the consequences.</li>
            <li><strong>Pro-Palestine Protests:</strong> He walks into crowds and asks the questions journalists are afraid to ask. He documents the chaos and challenges the narratives pushed by activists.</li>
            <li><strong>Urban Decay & Public Safety:</strong> He shows the truth behind rising crime and deteriorating infrastructure. No spin, no excuses—just the brutal reality of what’s happening.</li>
            <li><strong>Government Waste:</strong> The Minnesota childcare fraud story is the ultimate example—BILLIONS potentially stolen from taxpayers while politicians look the other way.</li>
            <li><strong>Anti-Socialism Warnings:</strong> Interviews with North Korean defectors reveal the terrifying reality of authoritarian regimes, cautioning America about the dangers of unchecked government control.</li>
          </ul>

          <h2 className="text-xl font-bold mt-12 mb-4 font-headline">The Mission Is Clear</h2>
          <p className="text-base leading-relaxed mb-6">
            Shirley positions his work as truth from the streets—the reporting that happens when you bypass the filters and go straight to the source. His supporters see a fearless investigator willing to risk his safety to hold power accountable. His critics see rage-bait. But millions of viewers see something they can't find anywhere else: raw, unfiltered accountability journalism.
          </p>
          <p className="text-base leading-relaxed mb-6">
            This isn't about comfort. It's about exposing fraud, waste, and corruption that robs taxpayers and erodes trust. It's about demanding answers when politicians dodge questions.
          </p>
          <p className="text-base leading-relaxed mb-6">
            Support him or hate him, Nick Shirley isn't going anywhere. There are too many stories left to break, and too many people who need to be held accountable.
          </p>
          <p className="text-base leading-relaxed mb-6 font-bold">
            This is only the beginning.
          </p>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-gray-50 p-8 border border-gray-200 sticky top-8">
            <h3 className="font-bold text-sm mb-4 font-sans uppercase tracking-wider border-b-2 border-black pb-3">
              Where to Find Nick
            </h3>

            <div className="space-y-6">
              <a
                href="https://x.com/nickshirleyy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 hover:border-black transition-colors group"
              >
                <div className="bg-black text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold font-sans text-base">X / Twitter</span>
                  <span className="block text-sm text-gray-500">@nickshirleyy</span>
                </div>
              </a>

              <a
                href="https://youtube.com/@NickShirley"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 hover:border-black transition-colors group"
              >
                <div className="bg-red-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold font-sans text-base">YouTube</span>
                  <span className="block text-sm text-gray-500">@NickShirley</span>
                </div>
              </a>

              <a
                href="https://instagram.com/nickshirley"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 hover:border-black transition-colors group"
              >
                <div className="bg-pink-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold font-sans text-base">Instagram</span>
                  <span className="block text-sm text-gray-500">@nickshirley</span>
                </div>
              </a>

              <a
                href="https://facebook.com/profile.php?id=61555695281120"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 hover:border-black transition-colors group"
              >
                <div className="bg-blue-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold font-sans text-base">Facebook</span>
                  <span className="block text-sm text-gray-500">Nick Shirley</span>
                </div>
              </a>

              <a
                href="https://open.spotify.com/show/nickshirley"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 hover:border-black transition-colors group"
              >
                <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.439-1.38 9.9-0.72 13.559 1.56.42.18.6.72.18 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.299z" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold font-sans text-base">Podcast</span>
                  <span className="block text-sm text-gray-500">The Nick Shirley Show</span>
                </div>
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <h4 className="font-bold text-base mb-4 font-sans uppercase tracking-wider">Support the Work</h4>
              <p className="text-base text-gray-600 mb-6">
                Fund security and future exposés.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded text-base">
                  <span className="font-bold">Venmo / Cash App</span>
                  <span className="font-mono">@nickshirley21</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
