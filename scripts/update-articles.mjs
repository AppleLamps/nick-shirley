import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('ERROR: DATABASE_URL not found in environment');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

const articlesToUpdate = [
  {
    "id": 53,
    "title": "Exposed: The Billion-Dollar Fraud Scheme Crumbling Minnesota",
    "slug": "exposed-billion-dollar-fraud-minnesota",
    "excerpt": "Apple Lamps reports on Nick Shirley's sit-down with a whistleblower to uncover a massive network of fake businesses draining billions from taxpayers under the nose of Tim Walz.",
    "content": "They call it \"Minnesota Nice,\" but what Apple Lamps reports Nick Shirley found on the streets of Minneapolis isn't nice—it is theft on an industrial scale. Shirley sat down with a whistleblower who has spent years documenting what is described as the \"worst fraud in human history.\" This isn't about a few thousand dollars slipped under the table; it is an alleged multi-billion dollar scheme involving fake daycares, phantom autism centers, and ghost transportation companies that are sucking the state dry.\n\n**The Reality on the Ground**\n\nThe reality Shirley uncovered stands in stark contrast to official records. He describes driving past \"businesses\" in industrial parks where the windows are blacked out and the doors are locked. In one instance, a facility claiming to care for over 100 children didn't have a single kid inside, yet state records show they are receiving millions of dollars in government assistance payments every year.\n\n**The Mechanics of the Steal**\n\nThe scheme revolves around the Department of Human Services and operates through several mechanisms:\n\n* **Ghost Daycares:** Facilities like \"Aurora Child Care\" claim to have capacity for over 100 kids in tiny, run-down buildings. They bill the state for millions—Aurora alone raked in $3.1 million in a single fiscal year—yet Shirley's source visited five times and saw zero children.\n* **Phantom Transportation:** There are over 1,000 non-emergency medical transportation companies registered in the state, 95% of which appear to be owned by a single demographic group. Shirley found vans sitting in parking lots that haven't moved an inch in a year, yet the checks keep clearing. \n* **Autism Centers:** There is a massive spike in \"autism centers\" that don't require licenses to open. They claim children are autistic to receive higher payout rates, often without proper medical verification.\n\n**Political Cover and Human Cost**\n\nAccording to Shirley's investigation, this is allowed to happen because of fear. Under Governor Tim Walz, the state government appears terrified of being called \"racist\" or \"Islamophobe,\" a political correctness that has paralyzed the fraud department. When inspectors do find violations, they accept a piece of paper saying it was fixed without verifying.\n\nThis isn't a victimless crime; there are serious allegations that some of these funds are being funneled out of the country to groups like Al-Shabaab. Meanwhile, the whistleblower exposing this has faced knife attacks and death threats.",
    "featured_image": null,
    "category": "investigation",
    "source_type": "youtube",
    "source_url": "https://youtu.be/LmIrwjKQQKc",
    "published": true,
    "featured": true,
    "created_at": "2026-01-05T18:06:00.000Z",
    "updated_at": "2026-01-05T18:06:00.000Z"
  },
  {
    "id": 52,
    "title": "The 'Healthcare Malls' of Minneapolis: Inside Shirley's Run-in with the Police",
    "slug": "minneapolis-healthcare-fraud-police-encounter",
    "excerpt": "Apple Lamps details how Nick Shirley found office buildings housing up to 22 nearly identical 'healthcare' companies. When he asked for rates, the police were called.",
    "content": "If one were looking for competitive healthcare rates, a building housing 14 different home healthcare companies would seem like a logical starting point. However, as Apple Lamps reports, Nick Shirley discovered that these buildings in Minneapolis aren't competing for business—they appear to be cooperating in fraud.\n\n## The Healthcare Clusters\n\nFollowing leads on a massive fraud scandal, Shirley visited several office buildings locals describe as \"healthcare malls.\" In one building alone, his team counted 14 separate Somali-owned home healthcare LLCs. In another, there were 22. \n\n## The Scheme\n\nThe allegation Shirley investigated is that these companies bill the state for Personal Care Assistant (PCA) services and transportation that never happen. The evidence Shirley captured was telling: when he entered these businesses asking to sign up a \"family member,\" the reaction was panic. Doors were shut, \"no trespassing\" signs were pointed out, and eventually, the police were called to escort him out.\n\nShirley also observed transportation vans—allegedly billing for medical rides—that hadn't moved in months, sitting in snowy lots with no footprints around them.\n\n## Confronting the Enablers\n\nThe most shocking part of the investigation was the government's response. Shirley took his findings to the Minnesota State Capitol. When he confronted a Democrat representative about the fraud happening under the current administration, the response was a deflection to \"non-partisan\" talking points. She claimed she didn't think anybody was enabling fraud, despite the FBI raids and billions in documented losses. Shirley's investigation suggests a money-laundering machine operating in plain sight, protected by a political class unwilling to ask hard questions.",
    "featured_image": null,
    "category": "investigation",
    "source_type": "original",
    "source_url": null,
    "published": true,
    "featured": false,
    "created_at": "2026-01-03T05:43:39.764Z",
    "updated_at": "2026-01-05T23:00:58.114Z"
  },
  {
    "id": 51,
    "title": "Paradise Lost: Shirley Reports on Hawaiians One Paycheck Away from Homelessness",
    "slug": "hawaii-economic-struggle-trump-term",
    "excerpt": "While Washington argues over politics, Hawaiians are drowning in the highest cost of living in the nation. Apple Lamps reviews Nick Shirley's trip to the islands to see the struggle firsthand.",
    "content": "We often think of Hawaii as the ultimate getaway—a paradise of beaches and relaxation. But after Nick Shirley traveled from New York to Honolulu, Apple Lamps reports he found a starkly different reality on the ground: the locals aren't relaxing; they're surviving.\n\n## The Cost of Paradise\n\n\"It's like a rat race,\" one resident told Shirley. \"Everyone's working like seven days a week to survive.\"\n\nHawaii currently stands as the most unaffordable state in the Union. Through his interviews, Shirley identified the culprits: massive inflation, housing bought up by outsiders, and a supply chain that makes basic goods astronomically expensive. One local broke it down simply for the camera: \"You're one medical episode away from being broke.\"\n\n## Political Disconnect\n\nWhat is interesting is the reaction Shirley received regarding the current political landscape. He asked residents how they felt about the second term of the Trump presidency, and the feedback was mixed with disappointment.\n\n\"I voted for Trump... thinking things are going to be better,\" one woman admitted to Shirley. \"And then the opposite has just happened... It's kind of a scary situation.\"\n\n## The Takeaway\n\nShirley's reporting highlights that the \"State of America\" looks very different depending on your zip code. In D.C., the fight is about ideology, but in Hawaii, the fight is to keep a roof over your head. The locals Shirley spoke to feel that politicians in D.C. are catering to \"big players\" while the price of gas bleeds the working class dry.",
    "featured_image": null,
    "category": "analysis",
    "source_type": "original",
    "source_url": null,
    "published": true,
    "featured": false,
    "created_at": "2026-01-03T05:43:39.757Z",
    "updated_at": "2026-01-05T23:01:07.521Z"
  },
  {
    "id": 50,
    "title": "The Great Divide: Americans React to Mass Deportations and 'Reverse Migration'",
    "slug": "americans-react-deportations-national-guard",
    "excerpt": "From 'Goodbye Fascist' in NYC to 'Get Documented' in Hawaii, Apple Lamps details how Nick Shirley asked Americans how they really feel about the National Guard and immigration enforcement.",
    "content": "The camera rolls on a street corner in New York City where Nick Shirley asks a man what he thinks about the current state of America. The response? The man looks at the camera, says \"Goodbye, fascist,\" and walks away.\n\nAs Apple Lamps notes, this is the polarized reality Shirley uncovered while traveling across the country. As reports of ICE raids and National Guard deployments circulate, the country is split down the middle on the concept of \"reverse migration.\"\n\n## The View from D.C.\n\nIn the nation's capital, Shirley found the tone shifted dramatically from New York. He spoke with a resident who praised the National Guard presence, pushing back against media narratives labeling them a \"Gestapo\" force.\n\n\"They are the nicest people on the planet,\" the resident told Shirley. \"I feel a lot safer as a D.C. resident with them here.\" This sentiment was echoed by those who feel the immigration system has broken down completely, with one woman telling Shirley, \"It's really become an invasion.\" \n\n## The 'Fascist' Label vs. The Middle\n\nBack in New York, Shirley documented palpable anger, with residents viewing enforcement actions as a betrayal of American values and bluntly calling the President a fascist. However, in Chicago, Shirley found a more pragmatic vibe. One man laughed off the National Guard presence, saying he hadn't seen them yet, but when pressed on the hard question—keep everyone or deport everyone?—even he leaned toward deportation.\n\nShirley's interviews reveal that while the media paints this as a simple battle between racists and humanitarians, the street-level view is far more complex.",
    "featured_image": null,
    "category": "news",
    "source_type": "original",
    "source_url": null,
    "published": true,
    "featured": false,
    "created_at": "2026-01-03T05:43:39.751Z",
    "updated_at": "2026-01-03T05:44:04.094Z"
  },
  {
    "id": 49,
    "title": "Pigs, Protests, and 'Kryptonite': Shirley Documents the Clash Over Islam in Texas",
    "slug": "plano-texas-islam-protest-clash",
    "excerpt": "Tensions boil over in Plano as protesters armed with bacon and pigs confront a growing Muslim community. Apple Lamps reports on Nick Shirley's ground coverage of the chaos.",
    "content": "In a parking lot in Texas, Nick Shirley found Jake Lang holding a live piglet he called \"Muhammad's kryptonite.\" As Apple Lamps reports, this was the prelude to a march on the Epic City Mosque in Plano, Texas, organized to protest what the group calls the \"Islamification\" of the state.\n\n## The Setup\n\nShirley traveled to Plano to witness a collision of worldviews. On one side stood Lang—a January 6th defendant—leading a group convinced that the rapid construction of over 40 mosques in the Dallas area signals a cultural takeover. Lang's rhetoric was uncompromising: \"We will drive you back to where you came from with pigs in our hands and Jesus in our hearts,\" he told the crowd. The visual was stark: American flags, crosses, and actual pigs—both live and dead—paraded toward the mosque.\n\n## The Counter-Narrative\n\nAt the mosque, Shirley interviewed the other side. A Muslim father dismissed the protesters as \"paid agitators,\" telling Shirley that they are loving people. Another counter-protester, holding a Palestinian flag, challenged the \"go back home\" narrative directly, shouting back, \"Go back to Nazi Germany, how about that?\"\n\n## The Verdict\n\nShirley's interviews reveal that this isn't happening in a vacuum; locals expressed genuine fear that their \"way of life\" is being eroded, with one woman stating she would \"pick up a gun\" to keep Texas free from Islamic ideology. Shirley's reporting highlights a deep cultural fracture where methods like bacon in the Quran and pig heads on sticks are used to provoke, tapping into real anxiety among a segment of the population.",
    "featured_image": null,
    "category": "on-the-ground",
    "source_type": "original",
    "source_url": null,
    "published": true,
    "featured": false,
    "created_at": "2026-01-03T05:43:39.726Z",
    "updated_at": "2026-01-03T05:44:00.078Z"
  },
  {
    "id": 48,
    "title": "Investigating Minnesota's 'Ghost Children': Nick Shirley Exposes the Billion-Dollar Daycare Scandal",
    "slug": "minnesota-ghost-children-fraud-investigation",
    "excerpt": "Nick Shirley went to daycares claiming to serve hundreds of children, only to find blacked-out windows, locked doors, and zero kids. Apple Lamps asks: Where is the money going?",
    "content": "Nick Shirley hit the streets of Minneapolis to investigate what is being called the largest fraud scandal in U.S. history. As Apple Lamps reports, the premise of the investigation was simple but devastating: state records show millions of taxpayer dollars flowing into daycare centers that, upon inspection, appear to be completely empty.\n\n## The Scene and Numbers\n\nTeaming up with David, a local investigator who has spent years tracking the money, Shirley drove from site to site with state paperwork in hand. At one location, 'Mako Child Care' and 'Mini Child Care Center' were registered at the same address, licensed for 120 children and raking in nearly $3 million in recent fiscal years. When Shirley arrived at 2:00 PM on a Tuesday, the scene was eerie: silence, no parents, just a locked industrial door and blacked-out windows. \n\nThe data Shirley and David presented is staggering:\n\n* **Future Leaders Early Learning Center:** Received over $6.6 million in two years, licensed for 90 children, yet Shirley found none on site.\n* **Super Kids Daycare Center:** Formerly 'Creative Minds' (shut down for violations), it reportedly reopened the next day under a new name to collect $2.45 million this year.\n* **Quality Learning Center:** A storefront that received $1.9 million this year alone, notably misspelling 'Learning' on their front signage.\n\n## Confronting the Reality\n\nThe investigation took a tense turn when Shirley attempted to enter these facilities. At one location, a man claiming to be the owner refused to answer questions about the missing 74 children, telling Shirley he was \"scared\" of him because of his color. Shirley also spoke to a neighbor who has lived next to one of these alleged daycares for eight years, who stated: \"I've never seen a single child walk in that building. It's disgusting. They're stealing the money.\"",
    "featured_image": null,
    "category": "investigation",
    "source_type": "original",
    "source_url": null,
    "published": true,
    "featured": false,
    "created_at": "2026-01-03T05:43:39.710Z",
    "updated_at": "2026-01-05T23:53:23.321Z"
  }
];

async function updateArticles() {
    console.log('Updating articles...\n');

    try {
        let updated = 0;

        for (const article of articlesToUpdate) {
            console.log(`Updating article ID ${article.id}: ${article.title}`);

            await sql`
                INSERT INTO articles (
                    title,
                    slug,
                    excerpt,
                    content,
                    featured_image,
                    category,
                    source_type,
                    source_url,
                    published,
                    featured,
                    created_at
                ) VALUES (
                    ${article.title},
                    ${article.slug},
                    ${article.excerpt},
                    ${article.content},
                    ${article.featured_image},
                    ${article.category},
                    ${article.source_type},
                    ${article.source_url},
                    ${article.published},
                    ${article.featured},
                    ${article.created_at}
                )
                ON CONFLICT (slug) DO UPDATE SET
                    title = EXCLUDED.title,
                    excerpt = EXCLUDED.excerpt,
                    content = EXCLUDED.content,
                    featured_image = EXCLUDED.featured_image,
                    category = EXCLUDED.category,
                    source_type = EXCLUDED.source_type,
                    source_url = EXCLUDED.source_url,
                    published = EXCLUDED.published,
                    featured = EXCLUDED.featured,
                    created_at = EXCLUDED.created_at,
                    updated_at = CURRENT_TIMESTAMP;
            `;
            updated++;
        }

        console.log(`\nSuccessfully updated ${updated} articles!`);

    } catch (error) {
        console.error('\nError updating articles:', error.message);
        process.exit(1);
    }
}

updateArticles();
