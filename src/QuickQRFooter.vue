<script setup lang="ts">
// NOTE: I've added a fourth column here to hold the utility links (Status, etc.)
// A 4-column structure is more typical for this type of product footer.
const columns = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "/#" },
      { label: "Features", href: "/#" },
      { label: "Pricing", href: "/#" },
      { label: "Changelog", href: "/#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#" },
      { label: "Careers", href: "/#" },
      { label: "Press", href: "/#" },
      { label: "Contact", href: "/#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "/#" },
      { label: "API Status", href: "/#" },
      { label: "Guides", href: "/#" },
      { label: "Blog", href: "/#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      // Renamed for better semantics and clarity
      { label: "Terms of Service", href: "/#" },
      { label: "Privacy Policy", href: "/#" },
      { label: "Cookie Policy", href: "/#" },
      { label: "System Status", href: "/#" },
    ],
  },
]
</script>

<template>
  <footer
    class="w-full border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950/90"
    aria-labelledby="footer-heading"
  >
    <div class="mx-auto max-w-7xl px-6 py-24 lg:py-28">
      <div
        class="flex flex-col gap-20 lg:flex-row lg:justify-between lg:gap-24"
      >
        <div class="flex flex-col justify-start lg:w-1/4">
          <img
            src="../public/quickqr-logo-with-text-overlap.svg"
            alt="QuickQR"
            class="h-24 w-auto dark:invert"
            loading="lazy"
          />
          <p
            class="mt-8 text-base text-neutral-600 dark:text-neutral-400 w-full text-left"
          >
            Generate fully customized QR Codes, with color &amp; shape, logo
            and track key analytics like scans, location, and time.
          </p>
        </div>

        <div
          class="grid grid-cols-2 gap-x-12 gap-y-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-16 lg:w-3/4"
          role="navigation"
          aria-label="Footer"
        >
          <section
            v-for="(col, i) in columns"
            :key="i"
            class="min-w-0"
          >
            <h3
              class="text-lg font-bold tracking-wide text-neutral-600 dark:text-neutral-300"
            >
              {{ col.heading }}
            </h3>
            <ul class="mt-6 space-y-4">
              <li v-for="(link, j) in col.links" :key="j">
                <a
                  :href="link.href"
                  class="text-base text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <div class="border-t border-neutral-200 dark:border-neutral-800">
      <div
        class="mx-auto max-w-7xl px-6 py-6"
      >
        <p class="text-sm text-neutral-500 dark:text-neutral-500">
          © {{ new Date().getFullYear() }} QuickQR. All rights reserved.
          <span class="px-2 text-neutral-300 dark:text-neutral-700">|</span>
          <a href="#" class="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">Bakersfield, CA</a>
        </p>
      </div>
    </div>
  </footer>
</template>
