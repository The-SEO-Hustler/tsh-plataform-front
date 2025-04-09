'use client'

import React from 'react'
import CountUp from 'react-countup'
import Container from '../container'
import { useInView } from 'react-intersection-observer'

export default function CountUpMetrics({ metrics }) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  // Enhanced helper function to parse the metric number
  const parseMetricNumber = (numberString) => {
    // Extract prefix (like $)
    const prefix = numberString.match(/^[^0-9]*/)?.[0] || '';

    // Extract suffix (like + or %)
    const suffix = numberString.match(/[^0-9.]*$/)?.[0] || '';

    // Extract the numeric part
    const numericPart = numberString.replace(/[^0-9.]/g, '');

    // Check if it's a percentage
    const isPercentage = numberString.includes("%");

    // Parse the numeric value
    const value = parseFloat(numericPart);

    // Handle special cases like 'K' (thousands) or 'M' (millions)



    return {
      value: value,
      prefix,
      suffix,
      isPercentage,
      // For display purposes, we'll use the original format
      displayFormat: `${prefix}${value}${suffix}`
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-[#4e503a] to-black text-white">
      <Container>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, index) => {
            const { value, prefix, suffix, isPercentage, displayFormat } = parseMetricNumber(metric.number)

            return (
              <div key={index} className="p-6">
                <div className="text-5xl font-black text-yellow-400 mb-2">
                  {inView ? (
                    <>
                      {prefix}
                      <CountUp
                        end={value}
                        suffix={suffix}
                        duration={2.5}
                        delay={index * 0.2}
                        decimals={isPercentage ? 0 : 0}
                      />
                    </>
                  ) : (
                    displayFormat
                  )}
                </div>
                <div className="text-white/80">{metric.label}</div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}