import "./home.css";
import bonsaiImage from "../../../assets/images/Bonsai.png";

export default function Home() {
  return (
    <>
      <div className="home-hero">
      			<h1 className="home-hero__title">Sushi, crafted with intent.</h1>
      			Mursu Sushi is not just a sushi restaurant. It is a story.
      			<br /><br />
      			When we started our exquisite voyage into the world of the utmost
      			delicate tastes, <br />we did not think it would become something of
      			this magnitude.
      			<br /><br />
      			Be it visiting our restaurant or ordering online, our number one
      			priority is ensuring that <br />our customers get the best dining
      			experience possible.
      			<br /><br />
      			Mursu Sushi, the taste of excellence.
      			<br /><br />
      			<div className="home-hero__actions">
      				<a
						href="/menu"
      					className="btn btn--small btn--light"
      					>View Menu</a
      				>
					<a href="/combo-builder" className="btn btn--small"
      					>Build A Set</a
      				>
      			</div>
      		</div>
			<section className="home-bonsai">
      			<img
					src={bonsaiImage}
      				alt="Bonsai"
      				className="home-bonsai__image"
      			/>
      		</section>
			<section className="system-core light-theme">
				<div className="system-core__container">
      				<div className="system-core__content">
      					<h2 className="system-core__header">SYSTEM CORE</h2>
      					<ul className="system-core__list">
      						<li className="system-item">
      							<div className="system-item__number">01</div>
      							<div className="system-item__content">
      								<div className="system-item__title">
      									BUILD YOUR SET
      								</div>
      								<div className="system-item__subtitle">
      									MODULAR COMPOSITION
      								</div>
      							</div>
      						</li>
      						<li className="system-item">
      							<div className="system-item__number">02</div>
      							<div className="system-item__content">
      								<div className="system-item__title">
      									LIVE TRACKING
      								</div>
      								<div className="system-item__subtitle">
      									REAL-TIME TELEMETRY
      								</div>
      							</div>
      						</li>
      						<li className="system-item">
      							<div className="system-item__number">03</div>
      							<div className="system-item__content">
      								<div className="system-item__title">
      									EARN BADGES
      								</div>
      								<div className="system-item__subtitle">
      									LOYALTY PROTOCOL
      								</div>
      							</div>
      						</li>
      						<li className="system-item">
      							<div className="system-item__number">04</div>
      							<div className="system-item__content">
      								<div className="system-item__title">
      									DIETARY INFO
      								</div>
      								<div className="system-item__subtitle">
      									NUTRITIONAL ANALYSIS
      								</div>
      							</div>
      						</li>
      					</ul>
      				</div>
      				<div className="system-preview">
      					<div className="system-preview__box">
      						<div className="system-preview__diamond"></div>
      						<div className="system-preview__text">Your food here</div>
      					</div>
      				</div>
      			</div>
      		</section>
			<section className="user-transcripts light-theme">
				<div>
      				<h2 className="user-transcripts__header">USER TRANSCRIPTS</h2>
      				<div className="user-transcripts__grid">
      					<div className="transcript">
      						<div className="transcript__quote">
      							"The geometric precision of the nigiri assembly is
      							unmatched. A true feast for the senses."
      						</div>
      						<div>
      							<div className="transcript__divider"></div>
      							<div className="transcript__author-name">
      								E. VANDERBILT
      							</div>
      							<div className="transcript__author-role">
      								STRUCTURAL ENGINEER
      							</div>
      						</div>
      					</div>
      					<div className="transcript">
      						<div className="transcript__quote">
      							"A UI that understands the rhythm of high-end
      							dining. No friction, only flavor."
      						</div>
      						<div>
      							<div className="transcript__divider"></div>
      							<div className="transcript__author-name">M. SATO</div>
      							<div className="transcript__author-role">
      								PRODUCT DESIGNER
      							</div>
      						</div>
      					</div>
      					<div className="transcript">
      						<div className="transcript__quote">
      							"The tracking protocol allowed me to time my arrival
      							within a 30-second window. Efficient."
      						</div>
      						<div>
      							<div className="transcript__divider"></div>
      							<div className="transcript__author-name">
      								J. ARNAULT
      							</div>
      							<div className="transcript__author-role">
      								OPERATIONS LEAD
      							</div>
      						</div>
      					</div>
      				</div>
      			</div>
      		</section>
      		<section className="home-info-grid">
      			<div className="home-info-card home-info-card--with-divider">
      				<h2 className="home-info-card__title">ACCESS</h2>
      				<address className="home-info-card__text home-info-card__address">
      					MURSU SUSHI<br />
      					EIRANRANTA 7<br />
      					HELSINKI, FIN 00150
      					<br /><br />
      					STREET LEVEL 01
      				</address>
      			</div>
      			<div className="home-info-card home-info-card--with-divider">
      				<h2 className="home-info-card__title">SCHEDULE</h2>
      				<div className="home-info-card__text home-info-card__schedule">
      					<div className="home-info-card__schedule-row">
      						<span>MON—WED</span>
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
      					<div className="home-info-card__note">
      						LATE ADMISSION PERMITTED
      					</div>
      				</div>
      			</div>
      			<div className="home-info-card home-info-card--with-divider">
      				<h2 className="home-info-card__title">CONTACT</h2>
      				<div className="home-info-card__text">
      					MURSU@MURSUSUSHI.ZEN<br /><br />
      					+358 10 515 0143
      				</div>
      			</div>
      			<div className="home-info-card">
      				<h2 className="home-info-card__title">TRANSPORT</h2>
      				<div className="home-info-card__text">
      					Tram from Central Railway Station <br />
      					+10 MIN WALK<br /><br />
      					PARKING: STREET LEVEL
      				</div>
      			</div>
      		</section>
    </>
  );
}
