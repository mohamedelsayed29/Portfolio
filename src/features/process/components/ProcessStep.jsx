import { Reveal } from '@components/common'

export function ProcessStep({ step, index }) {
  return (
    <Reveal as="li" delay={index * 0.08} className="relative ps-16 sm:ps-24">
      <span className="absolute top-0 start-0 grid size-11 place-items-center rounded-full border border-line bg-bg font-mono text-[13px] font-medium text-text-muted sm:size-14 sm:text-[15px]">
        {step.step}
      </span>

      <div className="flex flex-col gap-3 pb-14">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
            {step.title}
          </h3>
          <span className="text-[13px] text-text-subtle">{step.duration}</span>
        </div>
        <p className="max-w-[54ch] text-[16px] leading-relaxed text-text-muted">
          {step.description}
        </p>
      </div>
    </Reveal>
  )
}
