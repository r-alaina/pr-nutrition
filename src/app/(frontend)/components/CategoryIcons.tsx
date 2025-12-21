import React from 'react'

interface IconProps {
    className?: string
}

export const BreakfastIcon: React.FC<IconProps> = ({ className }) => (
    <div
        className={className}
        style={{
            maskImage: "url('/assets/icons/breakfast.png')",
            WebkitMaskImage: "url('/assets/icons/breakfast.png')",
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
        }}
    />
)

export const MainIcon: React.FC<IconProps> = ({ className }) => (
    <div
        className={className}
        style={{
            maskImage: "url('/assets/icons/main.png')",
            WebkitMaskImage: "url('/assets/icons/main.png')",
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
        }}
    />
)

export const SnackIcon: React.FC<IconProps> = ({ className }) => (
    <div
        className={className}
        style={{
            maskImage: "url('/assets/icons/snack.png')",
            WebkitMaskImage: "url('/assets/icons/snack.png')",
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
        }}
    />
)

export const SaladIcon: React.FC<IconProps> = ({ className }) => (
    <div
        className={className}
        style={{
            maskImage: "url('/assets/icons/salad.png')",
            WebkitMaskImage: "url('/assets/icons/salad.png')",
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
        }}
    />
)
