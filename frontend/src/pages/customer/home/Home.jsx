import "./home.css";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import bonsaiImage from "../../../assets/images/Bonsai.png";
import mapImage from "../../../assets/images/Map.png";

export default function Home() {
	const { t } = useTranslation();
	const titleList = [t("home.hero_title_main"), t("home.hero_title_alt")];
	const [titleId, setTitleId] = useState(0);
	const [titleAnim, setTitleAnim] = useState("reveal");
	const [isMobileTitle, setIsMobileTitle] = useState(false);
	const systemCoreRef = useRef(null);

	useEffect(() => {
		const compactMediaQuery = window.matchMedia("(max-width: 960px)");
		const update = () => {
			setIsMobileTitle(compactMediaQuery.matches);
		};

		update();
		compactMediaQuery.addEventListener("change", update);

		return () => {
			compactMediaQuery.removeEventListener("change", update);
		};
	}, []);

	useEffect(() => {
		if (isMobileTitle) {
			setTitleId(0);
			setTitleAnim("reveal");
			return undefined;
		}

		let waiters = [];
		const timer = setInterval(() => {
			setTitleAnim("erase");

			const waiter = setTimeout(() => {
				setTitleId((old) => (old + 1) % titleList.length);
				setTitleAnim("reveal");
			}, 1500);
			waiters.push(waiter);
		}, 5600);

		return () => {
			clearInterval(timer);
			waiters.forEach((timeoutId) => clearTimeout(timeoutId));
		};
	}, [isMobileTitle, titleList.length]);

	useEffect(() => {
		const el = systemCoreRef.current;
		if (!el) {
			return undefined;
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return undefined;
		}

		const mobile = window.matchMedia("(max-width: 960px)");

		const reset = () => {
			el.style.setProperty("--parallax-left-y", "0px");
			el.style.setProperty("--parallax-right-y", "0px");
			el.style.setProperty("--parallax-right-x", "0px");
			el.style.setProperty("--parallax-right-rotate", "0deg");
			el.style.setProperty("--parallax-right-scale", "1");
		};

		const move = () => {
			if (mobile.matches) {
				reset();
				return;
			}

			const box = el.getBoundingClientRect();
			const viewportCenter = window.innerHeight / 2;
			const sectionCenter = box.top + box.height / 2;
			const maxOffset = viewportCenter + box.height / 2;
			const progress = Math.max(
				-1,
				Math.min(1, (sectionCenter - viewportCenter) / maxOffset),
			);

			const depth = 1 - Math.abs(progress);

			el.style.setProperty("--parallax-left-y", `${progress * -180}px`);
			el.style.setProperty("--parallax-right-y", `${progress * 240}px`);
			el.style.setProperty("--parallax-right-x", `${progress * -90}px`);
			el.style.setProperty(
				"--parallax-right-rotate",
				`${progress * 11}deg`,
			);
			el.style.setProperty(
				"--parallax-right-scale",
				`${1 + depth * 0.14}`,
			);
		};

		const onScroll = () => move();

		move();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		mobile.addEventListener("change", onScroll);

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			mobile.removeEventListener("change", onScroll);
		};
	}, []);

	return (
		<>
			<div className="home-hero">
				<h1
					className={
						isMobileTitle
							? "home-hero__title"
							: `home-hero__title home-hero__title--${titleAnim}`
					}
				>
					<span className="home-hero__title-text">
						{titleList[titleId]}
					</span>
				</h1>
				<div className="home-hero__description">
					<p className="home-hero__line home-hero__line--1">
						{t("home.hero_line_1")}
					</p>
					<p className="home-hero__line home-hero__line--2">
						{t("home.hero_line_2")}
					</p>
					<p className="home-hero__line home-hero__line--4">
						{t("home.hero_line_3")}
					</p>
					<p className="home-hero__line home-hero__line--6">
						{t("home.hero_line_4")}
					</p>
				</div>
				<div className="home-hero__actions">
					<a href="/menu" className="btn btn--light">
						{t("home.view_menu")}
					</a>
					<a href="/combo-builder" className="btn">
						{t("home.build_set")}
					</a>
				</div>
			</div>
			<section className="home-bonsai">
				<img
					src={bonsaiImage}
					alt={t("home.bonsai_alt")}
					className="home-bonsai__image"
				/>
			</section>
			<section ref={systemCoreRef} className="system-core light-theme">
				<div className="system-core__container">
					<div className="system-core__content">
						<h2 className="system-core__header">
							{t("home.experience_title")}
						</h2>
						<ul className="system-core__list">
							<li className="system-item">
								<div className="system-item__number">01</div>
								<div className="system-item__content">
									<div className="system-item__title">
										{t("home.experience_item_1_title")}
									</div>
									<div className="system-item__subtitle">
										{t("home.experience_item_1_subtitle")}
									</div>
								</div>
							</li>
							<li className="system-item">
								<div className="system-item__number">02</div>
								<div className="system-item__content">
									<div className="system-item__title">
										{t("home.experience_item_2_title")}
									</div>
									<div className="system-item__subtitle">
										{t("home.experience_item_2_subtitle")}
									</div>
								</div>
							</li>
							<li className="system-item">
								<div className="system-item__number">03</div>
								<div className="system-item__content">
									<div className="system-item__title">
										{t("home.experience_item_3_title")}
									</div>
									<div className="system-item__subtitle">
										{t("home.experience_item_3_subtitle")}
									</div>
								</div>
							</li>
							<li className="system-item">
								<div className="system-item__number">04</div>
								<div className="system-item__content">
									<div className="system-item__title">
										{t("home.experience_item_4_title")}
									</div>
									<div className="system-item__subtitle">
										{t("home.experience_item_4_subtitle")}
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div className="system-preview">
						<div className="system-preview__box">
							<img
								src={mapImage}
								alt={t("home.map_alt")}
								className="system-preview__map"
							/>
						</div>
					</div>
				</div>
			</section>
			<section className="home-info-grid">
				<div className="home-info-card home-info-card--with-divider">
					<h2 className="home-info-card__title">
						{t("home.access")}
					</h2>
					<address className="home-info-card__text home-info-card__address">
						{t("home.address_name")}
						<br />
						{t("home.address_street")}
						<br />
						{t("home.address_city")}
					</address>
				</div>
				<div className="home-info-card home-info-card--with-divider">
					<h2 className="home-info-card__title">
						{t("home.schedule")}
					</h2>
					<div className="home-info-card__text home-info-card__schedule">
						<div className="home-info-card__schedule-row">
							<span>{t("home.mon")}</span>
							<span>11:00-21:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>{t("home.tue")}</span>
							<span>11:00-21:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>{t("home.wed")}</span>
							<span>11:00-21:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>{t("home.thu")}</span>
							<span>11:00-22:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>{t("home.fri")}</span>
							<span>11:00-23:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>{t("home.sat")}</span>
							<span>12:00-23:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>{t("home.sun")}</span>
							<span>{t("home.closed")}</span>
						</div>
					</div>
				</div>
				<div className="home-info-card home-info-card--with-divider">
					<h2 className="home-info-card__title">
						{t("home.contact")}
					</h2>
					<div className="home-info-card__text">
						<a
							href="mailto:mursu@mursusushi.zen"
							className="home-info-card__link"
						>
							{t("home.contact_email")}
						</a>
						<br />
						<a
							href="tel:+358105150143"
							className="home-info-card__link"
						>
							{t("home.contact_phone")}
						</a>
					</div>
				</div>
				<div className="home-info-card">
					<h2 className="home-info-card__title">
						{t("home.transport")}
					</h2>
					<div className="home-info-card__text">
						{t("home.transport_text")}
						<br />
					</div>
				</div>
			</section>
		</>
	);
}
