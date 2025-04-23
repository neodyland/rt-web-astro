import type React from "react";
import {
    type ComponentPropsWithoutRef,
    forwardRef,
    useState,
    useEffect,
    useCallback,
} from "react";
import { tv } from "tailwind-variants";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { MenuToggle } from "./MenuToggle";
import { useIsWide } from "./hooks";

const useLockBodyScroll = (isLocked: boolean) => {
    useEffect(() => {
        if (isLocked) {
            const originalStyle = window.getComputedStyle(
                document.body,
            ).overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isLocked]);
};

const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
    const [state, setState] = useState(initialValue);
    const toggle = useCallback(() => setState((prevState) => !prevState), []);
    return [state, toggle];
};

const headerVariants = tv({
    base: "fixed inset-x-0 top-0 z-50 py-2 transition-[padding-top,padding-bottom,box-shadow] ease-in-out lg:py-0 text-black",
    variants: {
        isScrolled: {
            true: "border-b border-outline bg-white border-white backdrop-blur lg:bg-opacity-90 shadow-lg",
            false: "bg-transparent lg:py-4",
        },
    },
});

const barVariants = {
    rest: { opacity: 0, y: 5 },
    hover: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.1,
            type: "spring",
        },
    },
};

const mobileMenuContainerVariants = {
    open: {
        display: "block",
    },
    closed: {
        display: "none",
        transition: { delay: 0.8 },
    },
};

const mobileMenuItemContainerVariants = {
    open: {
        opacity: 1,
        transition: {
            ease: "easeOut",
            staggerChildren: 0.07,
            delayChildren: 0.2,
        },
    },
    closed: {
        opacity: 0,
        transition: { delay: 0.6, staggerChildren: 0.05, staggerDirection: -1 },
    },
};

const mobileMenuItemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            ease: "easeOut",
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            ease: "easeIn",
            y: { stiffness: 1000 },
        },
    },
};

const mobileMenuButtonsVariants = {
    open: {
        opacity: 1,
        transition: { delay: 0.4, duration: 0.4 },
    },
    closed: {
        opacity: 0,
        transition: { delay: 0 },
    },
};

const headerAnimationVariants = {
    show: {
        top: 0,
        transition: { ease: "easeOut", stiffness: 100 },
    },
    hide: {
        top: -88,
    },
};

interface MobileMenuItemProps {
    name: string;
    href: string;
    index: number;
    isCurrent: boolean;
    color: string;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
    name,
    href,
    color,
    isCurrent,
}) => {
    return (
        <motion.li className="font-semibold" variants={mobileMenuItemVariants}>
            <a
                className="inline-flex w-full items-center py-4 leading-6 text-on-background"
                href={href}
            >
                <span className="pr-2">{name}</span>
                {isCurrent && (
                    <svg width="8" height="8">
                        <title>Current page</title>
                        <circle cx="4" cy="4" r="4" fill={color} />
                    </svg>
                )}
            </a>
        </motion.li>
    );
};

export interface HeaderButtonProps {
    href?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    title: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export interface HeaderProps extends ComponentPropsWithoutRef<"div"> {
    brand?: {
        name: string;
        href: string;
        logo: string;
        showTitle?: boolean;
        rounded?: boolean;
    };
    navigation: { name: string; href: string }[];
    buttons?: HeaderButtonProps[];
    color?: string;
    current?: string | number;
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>(
    (
        {
            navigation,
            brand = {
                logo: "/",
                href: "/",
                name: "/",
            },
            current,
            color,
            buttons,
        }: HeaderProps,
        ref,
    ) => {
        const [isScrolled, setIsScrolled] = useState(false);
        const [lastYPosition, setLastYPosition] = useState(0);
        const [isHeaderShown, setIsHeaderShown] = useState(true);
        const isWide = useIsWide();

        const { scrollY } = useScroll();
        const [isMobileMenuOpen, toggleMobileMenuOpen] = useToggle(false);

        const headerHeight = 88;

        useLockBodyScroll(isMobileMenuOpen);

        useMotionValueEvent(scrollY, "change", (latest) => {
            setIsScrolled(latest > 10);
            if (!isMobileMenuOpen) {
                setIsHeaderShown(
                    latest < headerHeight || latest < lastYPosition,
                );
                setLastYPosition(latest);
            }
        });

        return (
            <motion.header
                variants={headerAnimationVariants}
                initial={"show"}
                animate={
                    isWide || isMobileMenuOpen || isHeaderShown
                        ? "show"
                        : "hide"
                }
                className={headerVariants({ isScrolled })}
                ref={ref}
            >
                <motion.nav
                    className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 lg:h-16 lg:px-8"
                    initial={false}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                >
                    <MenuToggle toggle={() => toggleMobileMenuOpen()} />

                    <a
                        href={brand.href}
                        className="-m-1.5 flex items-center gap-2 p-1.5"
                    >
                        <img
                            className="h-10 w-auto transition-transform duration-300 transform hover:scale-110 hover:-rotate-6 active:scale-90"
                            src={brand.logo}
                            alt={brand.name}
                        />
                        {brand.showTitle && (
                            <span className="text-xl font-semibold text-on-background lg:text-base">
                                {brand.name}
                            </span>
                        )}
                    </a>

                    <motion.div
                        className="absolute inset-x-0 bottom-0 top-16 h-[calc(100svh-4rem)]  lg:hidden"
                        variants={mobileMenuContainerVariants}
                    >
                        <motion.ul
                            className="flex h-full w-full flex-col border-t border-outline bg-white px-6 py-4"
                            variants={mobileMenuItemContainerVariants}
                        >
                            {navigation.map((item, index) => {
                                const _color = color || "";
                                const isCurrent =
                                    (typeof current === "string" &&
                                        item.href === current) ||
                                    (typeof current === "number" &&
                                        index === current);
                                return (
                                    <MobileMenuItem
                                        key={item.name}
                                        name={item.name}
                                        href={item.href}
                                        index={index}
                                        color={_color}
                                        isCurrent={isCurrent}
                                    />
                                );
                            })}
                            {buttons?.length && (
                                <motion.div
                                    className="mt-auto flex flex-col gap-2"
                                    variants={mobileMenuButtonsVariants}
                                >
                                    {buttons?.map((buttonProps) => {
                                        return buttonProps.href ? (
                                            <a
                                                href={buttonProps.href}
                                                target={
                                                    buttonProps.target ??
                                                    "_self"
                                                }
                                                key={buttonProps.title}
                                            >
                                                <button
                                                    className="btn btn-neutral text-white"
                                                    {...buttonProps}
                                                >
                                                    {buttonProps.title}
                                                </button>
                                            </a>
                                        ) : (
                                            <button
                                                className="btn btn-neutral text-white"
                                                {...buttonProps}
                                                key={buttonProps.title}
                                            >
                                                {buttonProps.title}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </motion.ul>
                    </motion.div>

                    <div className="hidden h-full items-center py-4 lg:flex lg:gap-x-12">
                        {navigation.map((item, index) => {
                            const _color = color;
                            const isCurrent =
                                (typeof current === "string" &&
                                    item.href === current) ||
                                (typeof current === "number" &&
                                    index === current);
                            return (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    className="group relative text-sm font-semibold leading-6 text-on-background"
                                    initial="rest"
                                    whileHover="hover"
                                    animate="rest"
                                >
                                    {item.name}
                                    {isCurrent ? (
                                        <span className="absolute inset-x-0 -bottom-1.5 flex h-1 w-full items-center justify-center">
                                            <span
                                                style={{ background: _color }}
                                                className="h-[3px] w-3 rounded-full"
                                            />
                                        </span>
                                    ) : (
                                        <motion.span
                                            className="absolute inset-x-0 -bottom-1.5 hidden h-1 w-full items-center justify-center group-hover:flex"
                                            variants={barVariants}
                                        >
                                            <span
                                                style={{ background: _color }}
                                                className="h-[3px] w-1.5 rounded-full"
                                            />
                                        </motion.span>
                                    )}
                                </motion.a>
                            );
                        })}
                    </div>

                    <div className="hidden gap-2 lg:flex lg:justify-end">
                        {buttons?.map((buttonProps) => {
                            return buttonProps.href ? (
                                <a
                                    href={buttonProps.href}
                                    target={buttonProps.target ?? "_self"}
                                    key={buttonProps.title}
                                >
                                    <button
                                        className="btn btn-neutral text-white"
                                        {...buttonProps}
                                    >
                                        {buttonProps.title}
                                    </button>
                                </a>
                            ) : (
                                <button
                                    className="btn btn-neutral text-white"
                                    {...buttonProps}
                                    key={buttonProps.title}
                                >
                                    {buttonProps.title}
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-9 w-9 opacity-0 lg:hidden" />
                </motion.nav>
            </motion.header>
        );
    },
);
Header.displayName = "Header";
