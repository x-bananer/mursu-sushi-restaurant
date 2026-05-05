import "./home.css";
import { useEffect, useRef, useState } from "react";
import bonsaiImage from "../../../assets/images/Bonsai.png";
import mapImage from "../../../assets/images/Map.png";

export default function Home() {
	const titleList = ["Mursu Sushi", "Sushi, crafted with intent"];
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
			el.style.setProperty("--parallax-right-rotate", `${progress * 11}deg`);
			el.style.setProperty("--parallax-right-scale", `${1 + depth * 0.14}`);
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
					<span className="home-hero__title-text">{titleList[titleId]}</span>
				</h1>
				<div className="home-hero__description">
					<p className="home-hero__line home-hero__line--1">
						Mursu Sushi is not just a sushi restaurant. It is a story.
					</p>
					<p className="home-hero__line home-hero__line--2">
						When we started our exquisite voyage into the world of the utmost delicate tastes, we did not think it would become something of this magnitude.
					</p>
					<p className="home-hero__line home-hero__line--4">
						Be it visiting our restaurant or ordering online, our number one priority is ensuring that our customers get the best dining experience possible.
					</p>
					<p className="home-hero__line home-hero__line--6">
						Mursu Sushi, the taste of excellence.
					</p>
				</div>
				<div className="home-hero__actions">
					<a href="/menu" className="btn btn--light">
						View Menu
					</a>
					<a href="/combo-builder" className="btn">
						Build A Set
					</a>
				</div>
			</div>
			<section className="home-bonsai">
				<img
					src={bonsaiImage}
					alt="Bonsai"
					className="home-bonsai__image"
				/>
			</section>
			<section ref={systemCoreRef} className="system-core light-theme">
				<div className="system-core__container">
					<div className="system-core__content">
						<h2 className="system-core__header">THE MURSU EXPERIENCE</h2>
						<ul className="system-core__list">
							<li className="system-item">
								<div className="system-item__number">01</div>
								<div className="system-item__content">
									<div className="system-item__title">
										BUILD YOUR OWN COMBOS
									</div>
									<div className="system-item__subtitle">
										Create your set with ingredients and extras you actually want.
									</div>
								</div>
							</li>
							<li className="system-item">
								<div className="system-item__number">02</div>
								<div className="system-item__content">
									<div className="system-item__title">
										PICK YOUR FAVORITE DISHES
									</div>
									<div className="system-item__subtitle">
										Save favorites and get back to your go-to choices faster.
									</div>
								</div>
							</li>
							<li className="system-item">
								<div className="system-item__number">03</div>
								<div className="system-item__content">
									<div className="system-item__title">
										APPLY THE LOYALTY PROGRAM
									</div>
									<div className="system-item__subtitle">
										Collect stamps with each order and unlock discounts.
									</div>
								</div>
							</li>
							<li className="system-item">
								<div className="system-item__number">04</div>
								<div className="system-item__content">
									<div className="system-item__title">
										TRACK YOUR ORDER LIVE
									</div>
									<div className="system-item__subtitle">
										See real-time status updates from kitchen to delivery.
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div className="system-preview">
						<div className="system-preview__box">
							<img src={mapImage} alt="Mursu map" className="system-preview__map" />
						</div>
					</div>
				</div>
			</section>
			<section className="home-info-grid">
				<div className="home-info-card home-info-card--with-divider">
					<h2 className="home-info-card__title">ACCESS</h2>
					<address className="home-info-card__text home-info-card__address">
						MURSU SUSHI
						<br />
						Unioninkatu<br />
						HELSINKI, FIN 00170
					</address>
				</div>
				<div className="home-info-card home-info-card--with-divider">
					<h2 className="home-info-card__title">SCHEDULE</h2>
					<div className="home-info-card__text home-info-card__schedule">
						<div className="home-info-card__schedule-row">
							<span>MON</span>
							<span>11:00—21:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>TUE</span>
							<span>11:00—21:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>WED</span>
							<span>11:00—21:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>THU</span>
							<span>11:00—22:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>FRI</span>
							<span>11:00—23:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>SAT</span>
							<span>12:00—23:00</span>
						</div>
						<div className="home-info-card__schedule-row">
							<span>SUN</span>
							<span>CLOSED</span>
						</div>
					</div>
				</div>
				<div className="home-info-card home-info-card--with-divider">
					<h2 className="home-info-card__title">CONTACT</h2>
					<div className="home-info-card__text">
						<a href="mailto:mursu@mursusushi.zen" className="home-info-card__link">
							MURSU@MURSUSUSHI@FMAIL.COM
						</a>
						<br />
						<a href="tel:+358105150143" className="home-info-card__link">
							+358 10 515 0143
						</a>
					</div>
				</div>
				<div className="home-info-card">
					<h2 className="home-info-card__title">TRANSPORT</h2>
					<div className="home-info-card__text">
						10 MIN WALK from Central Railway Station <br />
					</div>
				</div>
			</section>
		</>
	);
}
