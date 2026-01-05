interface StatusBadgeProps {
    status?: string;
    textColor?: string;
    bgColor?: string;
    textSize?: string;
}

export default function StatusBadges({
    status = 'Draft',
    textColor = 'text-white',
    bgColor = 'bg-gray-500',
    textSize = 'text-xs'
}: StatusBadgeProps) {
    return <span className={`px-2 py-1 ${textSize} rounded-full ${bgColor} ${textColor}`}>{status}</span>;
}