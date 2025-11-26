'use client';

import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import CalculatorSchema from '@/components/CalculatorSchema';
import styles from './Construction.module.css';

export default function ConstructionHub() {
  const categories = [
    {
      name: 'Concrete Calculators',
      calculators: [
        {
          icon: '🏗️',
          title: 'Concrete Calculator',
          description: 'Calculate cubic yards for slabs, footings, columns, and stairs with waste factors and cost estimates.',
          link: '/calculators/concrete',
          buttonText: 'Calculate Concrete'
        },
        {
          icon: '🧱',
          title: 'Concrete Slab Calculator',
          description: 'Calculate concrete volume, rebar, and gravel base for patios, driveways, and garage slabs.',
          link: '/construction/concrete-slab',
          buttonText: 'Calculate Slab'
        },
        {
          icon: '🪜',
          title: 'Concrete Steps Calculator',
          description: 'Calculate concrete volume for porch steps, entry stairs, and landing areas.',
          link: '/construction/concrete-steps',
          buttonText: 'Calculate Steps'
        },
        {
          icon: '🔲',
          title: 'Footing Calculator',
          description: 'Calculate concrete and rebar for foundation footings, piers, and pad footings.',
          link: '/construction/footing',
          buttonText: 'Calculate Footing'
        },
        {
          icon: '🔩',
          title: 'Rebar Calculator',
          description: 'Calculate rebar quantity, spacing, and overlap requirements for reinforced concrete.',
          link: '/construction/rebar',
          buttonText: 'Calculate Rebar'
        },
        {
          icon: '🚧',
          title: 'Fence Post Concrete Calculator',
          description: 'Calculate concrete bags for fence post holes based on post size and depth.',
          link: '/construction/fence-post-concrete',
          buttonText: 'Calculate Posts'
        }
      ]
    },
    {
      name: 'Lumber & Framing Calculators',
      calculators: [
        {
          icon: '🪵',
          title: 'Lumber Calculator',
          description: 'Calculate board feet and framing materials for your construction project.',
          link: '/calculators/lumber',
          buttonText: 'Calculate Lumber'
        },
        {
          icon: '📐',
          title: 'Board Feet Calculator',
          description: 'Convert lumber dimensions to board feet with pricing and weight estimates.',
          link: '/construction/board-feet',
          buttonText: 'Calculate Board Feet'
        },
        {
          icon: '🏠',
          title: 'Stud Calculator',
          description: 'Calculate wall studs, plates, and headers for framing with 16" or 24" OC spacing.',
          link: '/construction/stud',
          buttonText: 'Calculate Studs'
        },
        {
          icon: '📏',
          title: 'Joist Span Calculator',
          description: 'Determine maximum joist spans based on size, spacing, species, and load requirements.',
          link: '/construction/joist-span',
          buttonText: 'Calculate Span'
        },
        {
          icon: '🔲',
          title: 'Beam Size Calculator',
          description: 'Calculate required beam dimensions for spans and loads.',
          link: '/construction/beam-size',
          buttonText: 'Calculate Beam'
        },
        {
          icon: '⚖️',
          title: 'Lumber Weight Calculator',
          description: 'Calculate lumber weight by species, dimensions, and moisture content.',
          link: '/construction/lumber-weight',
          buttonText: 'Calculate Weight'
        }
      ]
    },
    {
      name: 'Roofing Calculators',
      calculators: [
        {
          icon: '🏠',
          title: 'Roofing Calculator',
          description: 'Calculate roofing squares, shingles, underlayment, and materials with pitch factors.',
          link: '/construction/roofing',
          buttonText: 'Calculate Roofing'
        },
        {
          icon: '📐',
          title: 'Roof Pitch Calculator',
          description: 'Calculate roof pitch, angle, and area multiplier from rise and run measurements.',
          link: '/construction/roof-pitch',
          buttonText: 'Calculate Pitch'
        },
        {
          icon: '🔩',
          title: 'Metal Roofing Calculator',
          description: 'Calculate metal panels, screws, trim, and ridge cap for metal roof installations.',
          link: '/construction/metal-roofing',
          buttonText: 'Calculate Metal Roof'
        }
      ]
    },
    {
      name: 'Decking Calculators',
      calculators: [
        {
          icon: '🪵',
          title: 'Deck Calculator',
          description: 'Calculate complete deck materials including joists, boards, and railings.',
          link: '/calculators/deck',
          buttonText: 'Calculate Deck'
        },
        {
          icon: '📏',
          title: 'Deck Board Calculator',
          description: 'Calculate deck boards with optimized layouts to minimize waste and cuts.',
          link: '/construction/deck-boards',
          buttonText: 'Calculate Boards'
        },
        {
          icon: '🪜',
          title: 'Deck Stair Calculator',
          description: 'Calculate stair stringers, rise, run, and treads for code-compliant stairs.',
          link: '/construction/deck-stairs',
          buttonText: 'Calculate Stairs'
        },
        {
          icon: '🏗️',
          title: 'Deck Footing Calculator',
          description: 'Calculate footing size, depth, and concrete for deck post foundations.',
          link: '/construction/deck-footings',
          buttonText: 'Calculate Footings'
        },
        {
          icon: '🔲',
          title: 'Deck Joist Calculator',
          description: 'Calculate deck joists, blocking, and hanger requirements.',
          link: '/construction/deck-joists',
          buttonText: 'Calculate Joists'
        },
        {
          icon: '🚧',
          title: 'Deck Railing Calculator',
          description: 'Calculate posts, balusters, rails, and hardware for deck railings.',
          link: '/construction/deck-railing',
          buttonText: 'Calculate Railing'
        }
      ]
    },
    {
      name: 'Paint Calculators',
      calculators: [
        {
          icon: '🎨',
          title: 'Paint Calculator',
          description: 'Calculate gallons of paint needed for interior walls and ceilings.',
          link: '/calculators/paint',
          buttonText: 'Calculate Paint'
        },
        {
          icon: '🏡',
          title: 'Exterior Paint Calculator',
          description: 'Calculate paint for house exteriors including siding, trim, and multiple stories.',
          link: '/construction/exterior-paint',
          buttonText: 'Calculate Exterior'
        }
      ]
    },
    {
      name: 'Flooring & Tile Calculators',
      calculators: [
        {
          icon: '🔲',
          title: 'Tile Calculator',
          description: 'Calculate tiles, grout, and adhesive with waste factor for floors and walls.',
          link: '/construction/tile',
          buttonText: 'Calculate Tile'
        },
        {
          icon: '🪵',
          title: 'Hardwood Flooring Calculator',
          description: 'Calculate hardwood flooring square footage with waste and installation factors.',
          link: '/construction/hardwood-flooring',
          buttonText: 'Calculate Hardwood'
        },
        {
          icon: '📏',
          title: 'Laminate Flooring Calculator',
          description: 'Calculate laminate planks and boxes needed for your room dimensions.',
          link: '/construction/laminate-flooring',
          buttonText: 'Calculate Laminate'
        },
        {
          icon: '🧵',
          title: 'Carpet Calculator',
          description: 'Calculate carpet square yards and padding for rooms and stairs.',
          link: '/construction/carpet',
          buttonText: 'Calculate Carpet'
        },
        {
          icon: '🚿',
          title: 'Shower Tile Calculator',
          description: 'Calculate shower wall and floor tile, plus waterproofing and setting materials.',
          link: '/construction/shower-tile',
          buttonText: 'Calculate Shower'
        },
        {
          icon: '🍳',
          title: 'Backsplash Calculator',
          description: 'Calculate kitchen backsplash tile, thinset, and grout quantities.',
          link: '/construction/backsplash',
          buttonText: 'Calculate Backsplash'
        }
      ]
    },
    {
      name: 'Landscaping & Outdoor Calculators',
      calculators: [
        {
          icon: '🌿',
          title: 'Mulch Calculator',
          description: 'Calculate cubic yards of mulch for garden beds with depth recommendations.',
          link: '/construction/mulch',
          buttonText: 'Calculate Mulch'
        },
        {
          icon: '🪨',
          title: 'Gravel Calculator',
          description: 'Calculate gravel in cubic yards and tons for driveways and paths.',
          link: '/construction/gravel',
          buttonText: 'Calculate Gravel'
        },
        {
          icon: '🌱',
          title: 'Topsoil Calculator',
          description: 'Calculate topsoil cubic yards for gardens, lawns, and raised beds.',
          link: '/construction/topsoil',
          buttonText: 'Calculate Topsoil'
        },
        {
          icon: '🌾',
          title: 'Sod Calculator',
          description: 'Calculate sod square footage and pallets for lawn installation.',
          link: '/construction/sod',
          buttonText: 'Calculate Sod'
        },
        {
          icon: '🚧',
          title: 'Fence Calculator',
          description: 'Calculate fence posts, rails, pickets, and concrete for post holes.',
          link: '/calculators/fence',
          buttonText: 'Calculate Fence'
        },
        {
          icon: '🧱',
          title: 'Retaining Wall Calculator',
          description: 'Calculate retaining wall blocks, base material, and cap blocks.',
          link: '/construction/retaining-wall',
          buttonText: 'Calculate Wall'
        },
        {
          icon: '🧱',
          title: 'Paver Calculator',
          description: 'Calculate pavers, sand base, and edging for patios and walkways.',
          link: '/construction/paver',
          buttonText: 'Calculate Pavers'
        }
      ]
    },
    {
      name: 'Drywall Calculators',
      calculators: [
        {
          icon: '📋',
          title: 'Drywall Calculator',
          description: 'Calculate drywall sheets, joint compound, tape, and screws.',
          link: '/calculators/drywall',
          buttonText: 'Calculate Drywall'
        },
        {
          icon: '🪣',
          title: 'Drywall Mud Calculator',
          description: 'Calculate joint compound quantities based on finish level and square footage.',
          link: '/construction/drywall-mud',
          buttonText: 'Calculate Mud'
        }
      ]
    },
    {
      name: 'Stair Calculators',
      calculators: [
        {
          icon: '📐',
          title: 'Stair Stringer Calculator',
          description: 'Calculate stringer dimensions, rise, run, and cut angles for code compliance.',
          link: '/construction/stair-stringer',
          buttonText: 'Calculate Stringers'
        },
        {
          icon: '🔄',
          title: 'Spiral Stair Calculator',
          description: 'Calculate spiral staircase dimensions, treads, and rotation.',
          link: '/construction/spiral-stairs',
          buttonText: 'Calculate Spiral'
        }
      ]
    },
    {
      name: 'Electrical Calculators',
      calculators: [
        {
          icon: '⚡',
          title: 'Wire Size Calculator',
          description: 'Calculate proper wire gauge based on amperage, distance, and voltage drop.',
          link: '/construction/wire-size',
          buttonText: 'Calculate Wire Size'
        },
        {
          icon: '🔌',
          title: 'Electrical Load Calculator',
          description: 'Calculate total electrical load and service panel size requirements.',
          link: '/construction/electrical-load',
          buttonText: 'Calculate Load'
        },
        {
          icon: '🔲',
          title: 'Outlet Spacing Calculator',
          description: 'Calculate NEC-compliant outlet placement and quantity for rooms.',
          link: '/construction/outlet-spacing',
          buttonText: 'Calculate Outlets'
        }
      ]
    },
    {
      name: 'HVAC Calculators',
      calculators: [
        {
          icon: '❄️',
          title: 'BTU Calculator',
          description: 'Calculate heating and cooling BTU requirements for rooms and buildings.',
          link: '/construction/btu',
          buttonText: 'Calculate BTU'
        },
        {
          icon: '💨',
          title: 'Duct Size Calculator',
          description: 'Calculate duct dimensions based on CFM requirements and air velocity.',
          link: '/construction/duct-size',
          buttonText: 'Calculate Duct'
        }
      ]
    },
    {
      name: 'Masonry Calculators',
      calculators: [
        {
          icon: '🧱',
          title: 'Brick Calculator',
          description: 'Calculate bricks and mortar for walls, patios, and walkways.',
          link: '/construction/brick',
          buttonText: 'Calculate Bricks'
        },
        {
          icon: '🛡️',
          title: 'Insulation Calculator',
          description: 'Calculate insulation R-value and materials for walls, attics, and floors.',
          link: '/calculators/insulation',
          buttonText: 'Calculate Insulation'
        }
      ]
    }
  ];

  const faqItems = [
    {
      question: 'How accurate are these construction calculators?',
      answer: 'Our calculators use industry-standard formulas and include appropriate waste factors. However, always verify calculations with local building codes and consult professionals for structural work.'
    },
    {
      question: 'What waste factor should I use for construction materials?',
      answer: 'Standard waste factors are: 10% for concrete, 10-15% for roofing, 10% for flooring, 5-10% for lumber. Complex cuts or patterns may require higher waste factors.'
    },
    {
      question: 'Are these calculators suitable for professional contractors?',
      answer: 'Yes, our calculators are used by both DIYers and professional contractors. They provide accurate estimates that can be used for bidding and material ordering.'
    }
  ];

  return (
    <div className={styles.container}>
      <CalculatorSchema
        name="Construction Calculators"
        description="Free construction calculators for contractors and DIYers. Calculate materials for concrete, roofing, decking, lumber, flooring, and more."
        url="/construction"
        faqItems={faqItems}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Free Construction Calculators</h1>
        <p className={styles.heroSubtitle}>
          Professional-grade material calculators for contractors and DIYers.
          Estimate concrete, roofing, lumber, flooring, and more with accurate waste factors and cost estimates.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/calculators/concrete" className={styles.primaryButton}>
            Concrete Calculator
          </Link>
          <Link href="/construction/roofing" className={styles.primaryButton}>
            Roofing Calculator
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.introSection}>
        <h2 className={styles.sectionTitle}>Why Use Our Construction Calculators?</h2>
        <p className={styles.introText}>
          Ordering the right amount of materials is critical for any construction project. Order too little and you'll face
          costly delays and potential structural issues. Order too much and you're wasting money on materials you can't return.
        </p>
        <p className={styles.introText}>
          Our calculators include <strong>real-world waste factors</strong>, account for standard material sizes, and help you
          estimate costs accurately. Built with input from experienced contractors and updated for current material specifications.
        </p>
      </section>

      {/* Top Banner Ad */}
      <AdUnit adSlot="6981760215" className="ad-top-banner" />

      {/* Calculator Categories */}
      {categories.map((category, catIndex) => (
        <section key={catIndex} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{category.name}</h2>
          <div className={styles.calculatorGrid}>
            {category.calculators.map((calc, calcIndex) => (
              <div key={calcIndex} className={styles.calculatorCard}>
                <div className={styles.cardIcon}>{calc.icon}</div>
                <h3 className={styles.cardTitle}>{calc.title}</h3>
                <p className={styles.cardDescription}>{calc.description}</p>
                <Link href={calc.link} className={styles.cardButton}>
                  {calc.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Mid Content Ad */}
      <AdUnit adSlot="6129936879" className="ad-mid-content" />

      {/* Tips Section */}
      <section className={styles.tipSection}>
        <h2 className={styles.sectionTitle}>Material Estimating Tips</h2>
        <div className={styles.tipGrid}>
          <div className={styles.tipItem}>
            <h3>Always Add Waste Factor</h3>
            <p>Materials get cut, broken, or damaged during installation. Add 10-15% to your calculations for most materials. Complex patterns or first-time DIYers should add more.</p>
          </div>
          <div className={styles.tipItem}>
            <h3>Check Local Codes</h3>
            <p>Building codes vary by location. Always verify requirements for structural elements like footings, beams, and electrical work with your local building department.</p>
          </div>
          <div className={styles.tipItem}>
            <h3>Measure Twice, Order Once</h3>
            <p>Double-check all measurements before ordering. It's easier to re-measure than to return materials or wait for additional deliveries.</p>
          </div>
          <div className={styles.tipItem}>
            <h3>Consider Delivery Minimums</h3>
            <p>Many suppliers have minimum orders for delivery (e.g., 1 yard of concrete). Factor this into your planning to avoid short-load fees.</p>
          </div>
        </div>
        <div className={styles.warningBox}>
          <strong>Important:</strong> These calculators provide estimates for material quantities. Always consult with licensed professionals for structural work, electrical, plumbing, and any work requiring permits.
        </div>
      </section>

      {/* Sidebar Ad */}
      <AdUnit adSlot="5668678546" className="ad-sidebar" />

      {/* Value Section */}
      <section className={styles.valueSection}>
        <h2 className={styles.sectionTitle}>Free Tools for Builders</h2>
        <p className={styles.valueText}>
          All our construction calculators are <strong>completely free</strong>, require <strong>no signup</strong>, and work on any device.
          Used by thousands of contractors and DIYers every month to estimate materials accurately and bid projects confidently.
        </p>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <h2 className={styles.ctaTitle}>Start Calculating Your Project Materials</h2>
        <div className={styles.ctaButtons}>
          <Link href="/calculators/concrete" className={styles.secondaryButton}>
            Concrete
          </Link>
          <Link href="/construction/roofing" className={styles.secondaryButton}>
            Roofing
          </Link>
          <Link href="/calculators/deck" className={styles.secondaryButton}>
            Decking
          </Link>
          <Link href="/calculators/lumber" className={styles.secondaryButton}>
            Lumber
          </Link>
          <Link href="/calculators/paint" className={styles.secondaryButton}>
            Paint
          </Link>
          <Link href="/construction/tile" className={styles.secondaryButton}>
            Tile
          </Link>
          <Link href="/construction/mulch" className={styles.secondaryButton}>
            Mulch
          </Link>
          <Link href="/calculators/drywall" className={styles.secondaryButton}>
            Drywall
          </Link>
        </div>
      </section>

      {/* Footer Banner Ad */}
      <AdUnit adSlot="4136105023" className="ad-footer-banner" />
    </div>
  );
}
