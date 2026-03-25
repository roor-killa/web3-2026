--
-- PostgreSQL database dump
--

\restrict g8RzaNgQNaZaPKNHeCypbOml03LSgHERBpYhFdtqlrkT0GucdrU1qgTm0th71WY

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: produits; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.produits (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url text,
    price_france character varying(50),
    price_dom character varying(50),
    difference character varying(50),
    quantity_value numeric(10,4),
    quantity_unit character varying(20),
    unit_reference character varying(20),
    unit_price_france numeric(10,2),
    unit_price_dom numeric(10,2),
    territory character varying(10),
    territory_name character varying(100),
    scraped_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.produits OWNER TO laravel;

--
-- Name: produits_id_seq; Type: SEQUENCE; Schema: public; Owner: laravel
--

CREATE SEQUENCE public.produits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produits_id_seq OWNER TO laravel;

--
-- Name: produits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: laravel
--

ALTER SEQUENCE public.produits_id_seq OWNED BY public.produits.id;


--
-- Name: scrape_logs; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.scrape_logs (
    id integer NOT NULL,
    territory character varying(10) NOT NULL,
    pages integer DEFAULT 1,
    status character varying(20) DEFAULT 'running'::character varying,
    nb_produits integer DEFAULT 0,
    message text,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp without time zone
);


ALTER TABLE public.scrape_logs OWNER TO laravel;

--
-- Name: scrape_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: laravel
--

CREATE SEQUENCE public.scrape_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scrape_logs_id_seq OWNER TO laravel;

--
-- Name: scrape_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: laravel
--

ALTER SEQUENCE public.scrape_logs_id_seq OWNED BY public.scrape_logs.id;


--
-- Name: scrape_urls; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.scrape_urls (
    id integer NOT NULL,
    url text NOT NULL,
    label character varying(100),
    actif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_scraped_at timestamp without time zone,
    nb_donnees integer DEFAULT 0
);


ALTER TABLE public.scrape_urls OWNER TO laravel;

--
-- Name: scrape_urls_id_seq; Type: SEQUENCE; Schema: public; Owner: laravel
--

CREATE SEQUENCE public.scrape_urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scrape_urls_id_seq OWNER TO laravel;

--
-- Name: scrape_urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: laravel
--

ALTER SEQUENCE public.scrape_urls_id_seq OWNED BY public.scrape_urls.id;


--
-- Name: produits id; Type: DEFAULT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.produits ALTER COLUMN id SET DEFAULT nextval('public.produits_id_seq'::regclass);


--
-- Name: scrape_logs id; Type: DEFAULT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.scrape_logs ALTER COLUMN id SET DEFAULT nextval('public.scrape_logs_id_seq'::regclass);


--
-- Name: scrape_urls id; Type: DEFAULT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.scrape_urls ALTER COLUMN id SET DEFAULT nextval('public.scrape_urls_id_seq'::regclass);


--
-- Data for Name: produits; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.produits (id, name, url, price_france, price_dom, difference, quantity_value, quantity_unit, unit_reference, unit_price_france, unit_price_dom, territory, territory_name, scraped_at) FROM stdin;
1	Cidre Brut intense Loic Raison 75cl	https://www.kiprix.com/fr-mq/produit/4679	3,22 €	5,15 €	+ 59,94%	75.0000	cl	€/L	4.29	6.87	mq	Martinique	2026-03-11 19:05:24.597966
2	Olives vertes dénoyautées TRAMIER, sachet de	https://www.kiprix.com/fr-mq/produit/52355	2,61 €	3,35 €	+ 28,35%	\N	\N	\N	\N	\N	mq	Martinique	2026-03-11 19:05:24.597966
3	Biscuits Oréo pocket 3x246g	https://www.kiprix.com/fr-mq/produit/70336	6,29 €	10,45 €	+ 66,14%	246.0000	g	€/kg	25.57	42.48	mq	Martinique	2026-03-11 19:05:24.597966
4	Mélange de 3 Fruits secs, DACO BELLO sachet	https://www.kiprix.com/fr-mq/produit/62227	5,55 €	5,99 €	+ 7,93%	\N	\N	\N	\N	\N	mq	Martinique	2026-03-11 19:05:24.597966
5	IGP Cidre Loic Raison Doux fruité - 75cl	https://www.kiprix.com/fr-mq/produit/4680	3,14 €	5,15 €	+ 64,01%	75.0000	cl	€/L	4.19	6.87	mq	Martinique	2026-03-11 19:05:24.597966
6	Pâtes Macaroni BARILLA	https://www.kiprix.com/fr-mq/produit/52360	1,09 €	2,03 €	+ 86,24%	\N	\N	\N	\N	\N	mq	Martinique	2026-03-11 19:05:24.597966
7	Eau minérale naturelle Hépar 6x75cl	https://www.kiprix.com/fr-mq/produit/17505	4,10 €	9,55 €	+ 132,93%	75.0000	cl	€/L	5.47	12.73	mq	Martinique	2026-03-11 19:05:24.597966
8	Gel vaisselle Maison Net Gel concentré - Citron vert -1L	https://www.kiprix.com/fr-mq/produit/17380	3,69 €	4,99 €	+ 35,23%	1.0000	l	€/L	3.69	4.99	mq	Martinique	2026-03-11 19:05:24.597966
9	Miel liquide Bio Squeezer Bio village - 250g	https://www.kiprix.com/fr-mq/produit/7865	2,99 €	3,79 €	+ 26,76%	250.0000	g	€/kg	11.96	15.16	mq	Martinique	2026-03-11 19:05:24.597966
10	Capsules lave-vaisselle Finish Ultimate Plus Citron - x35	https://www.kiprix.com/fr-mq/produit/17359	9,85 €	14,09 €	+ 43,05%	\N	\N	\N	\N	\N	mq	Martinique	2026-03-11 19:05:24.597966
11	Liquide vaisselle Maison Net Vinaigre de cidre - 1L	https://www.kiprix.com/fr-mq/produit/17378	3,73 €	5,40 €	+ 44,77%	1.0000	l	€/L	3.73	5.40	mq	Martinique	2026-03-11 19:05:24.597966
12	Déodorant bille Narta  Homme nord extrême 48h - 50ml	https://www.kiprix.com/fr-mq/produit/7169	2,21 €	4,75 €	+ 114,93%	50.0000	ml	€/L	44.20	95.00	mq	Martinique	2026-03-11 19:05:24.597966
13	Crème glacée Häagen-Dazs  Vanille caramel brownie - 386g	https://www.kiprix.com/fr-mq/produit/11589	6,09 €	7,20 €	+ 18,23%	386.0000	g	€/kg	15.78	18.65	mq	Martinique	2026-03-11 19:05:24.597966
14	Pur jus Multifruits Bio  Bio Village - 75cl	https://www.kiprix.com/fr-mq/produit/274	2,49 €	4,28 €	+ 71,89%	75.0000	cl	€/L	3.32	5.71	mq	Martinique	2026-03-11 19:05:24.597966
15	Compotes Pom'Potes Gourdes BIO  Pomme Nature - 12x90g	https://www.kiprix.com/fr-mq/produit/3959	6,93 €	10,95 €	+ 58,01%	90.0000	g	€/kg	77.00	121.67	mq	Martinique	2026-03-11 19:05:24.597966
16	Bière Desperados Pack de 12x33cl	https://www.kiprix.com/fr-mq/produit/4599	14,58 €	25,20 €	+ 72,84%	33.0000	cl	€/L	44.18	76.36	mq	Martinique	2026-03-11 19:05:24.597966
17	U\nPurée de tomate  brique de	https://www.kiprix.com/fr-mq/produit/52614	0,79 €	1,17 €	+ 48,10%	\N	\N	\N	\N	\N	mq	Martinique	2026-03-11 19:05:24.597966
18	Compote Bio Village Gourdes Pomme - 12x90g	https://www.kiprix.com/fr-mq/produit/7885	5,30 €	7,60 €	+ 43,40%	90.0000	g	€/kg	58.89	84.44	mq	Martinique	2026-03-11 19:05:24.597966
19	Céréales Trésor cookie & cream Kellogg's - 375g	https://www.kiprix.com/fr-mq/produit/68516	3,27 €	4,36 €	+ 33,33%	375.0000	g	€/kg	8.72	11.63	mq	Martinique	2026-03-11 19:05:24.597966
20	Persil Plat 20g	https://www.kiprix.com/fr-mq/produit/82851	1,49 €	3,49 €	+ 134,23%	20.0000	g	€/kg	74.50	174.50	mq	Martinique	2026-03-11 19:05:24.597966
21	Bouillon de poule Knorr 15 tablettes - 150g	https://www.kiprix.com/fr-mq/produit/13762	€1.19	€2.30	+ 93.28%	150.0000	g	€/kg	7.93	15.33	mq	Martinique	2026-03-16 19:58:06.225282
22	Barres céréales Nesquik  Chocolat - 6x25g	https://www.kiprix.com/fr-mq/produit/3527	€1.79	€3.15	+ 75.98%	25.0000	g	€/kg	71.60	126.00	mq	Martinique	2026-03-16 19:58:06.225282
23	Barres de céréales Lion Chocolat caramel - 6x25g	https://www.kiprix.com/fr-mq/produit/3529	€1.81	€3.15	+ 74.03%	25.0000	g	€/kg	72.40	126.00	mq	Martinique	2026-03-16 19:58:06.225282
24	Cassoulet Toulousain   Raynal Et Roquelaure - 420g	https://www.kiprix.com/fr-mq/produit/956	€2.95	€4.20	+ 42.37%	420.0000	g	€/kg	7.02	10.00	mq	Martinique	2026-03-16 19:58:06.225282
25	Pepites de chocolat noir Vahiné - 100g	https://www.kiprix.com/fr-mq/produit/4418	€1.71	€3.45	+ 101.75%	100.0000	g	€/kg	17.10	34.50	mq	Martinique	2026-03-16 19:58:06.225282
26	Levure Chimique Alsacienne alsa 8 sachets - 88g	https://www.kiprix.com/fr-mq/produit/4306	€0.80	€1.55	+ 93.75%	88.0000	g	€/kg	9.09	17.61	mq	Martinique	2026-03-16 19:58:06.225282
27	Arôme vanille Vahiné 200ml	https://www.kiprix.com/fr-mq/produit/4444	€2.84	€3.59	+ 26.41%	200.0000	ml	€/L	14.20	17.95	mq	Martinique	2026-03-16 19:58:06.225282
28	Barres céréales Grany Chocolat - 125g	https://www.kiprix.com/fr-mq/produit/3538	€1.80	€3.20	+ 77.78%	125.0000	g	€/kg	14.40	25.60	mq	Martinique	2026-03-16 19:58:06.225282
29	Biscuits fourrés BN Chocolat - 375g	https://www.kiprix.com/fr-mq/produit/3113	€1.79	€4.90	+ 173.74%	375.0000	g	€/kg	4.77	13.07	mq	Martinique	2026-03-16 19:58:06.225282
30	Bouillon Cube Maggi Volaille - 80g	https://www.kiprix.com/fr-mq/produit/6756	€0.97	€1.59	+ 63.92%	80.0000	g	€/kg	12.12	19.88	mq	Martinique	2026-03-16 19:58:06.225282
31	Biscuit bébé Blédina 10 mois Boudoir - 120g	https://www.kiprix.com/fr-mq/produit/3464	€1.71	€3.15	+ 84.21%	120.0000	g	€/kg	14.25	26.25	mq	Martinique	2026-03-16 19:58:06.225282
32	Purée Mousline Crème et noix de muscade - 500g	https://www.kiprix.com/fr-mq/produit/8806	€3.19	€5.99	+ 87.77%	500.0000	g	€/kg	6.38	11.98	mq	Martinique	2026-03-16 19:58:06.225282
33	Noisettes en poudre Vahiné 100g	https://www.kiprix.com/fr-mq/produit/4427	€2.96	€4.70	+ 58.78%	100.0000	g	€/kg	29.60	47.00	mq	Martinique	2026-03-16 19:58:06.225282
34	Barres céréales Fitness Nestlé Chocolat - 6x23.5g	https://www.kiprix.com/fr-mq/produit/3547	€2.03	€3.13	+ 54.19%	23.5000	g	€/kg	86.38	133.19	mq	Martinique	2026-03-16 19:58:06.225282
35	Gin Gordon's 37.5%vol - 70cl	https://www.kiprix.com/fr-mq/produit/12971	€15.27	€19.95	+ 30.65%	70.0000	cl	€/L	21.81	28.50	mq	Martinique	2026-03-16 19:58:06.225282
36	Barres de céréales Chocapic Chocolat - 6x25g	https://www.kiprix.com/fr-mq/produit/3526	€1.77	€3.15	+ 78.02%	25.0000	g	€/kg	70.80	126.00	mq	Martinique	2026-03-16 19:58:06.225282
37	Arôme Saveur Maggi 250g	https://www.kiprix.com/fr-mq/produit/5778	€1.86	€3.50	+ 88.33%	250.0000	g	€/kg	7.44	14.00	mq	Martinique	2026-03-16 19:58:06.225282
38	Détachant poudre Vanish  Stop Odeurs - 470g	https://www.kiprix.com/fr-mq/produit/18493	€5.91	€8.20	+ 38.75%	470.0000	g	€/kg	12.57	17.45	mq	Martinique	2026-03-16 19:58:06.225282
39	Biscuits Pocket Petit Ecolier Chocolat au lait - 250g	https://www.kiprix.com/fr-mq/produit/6264	€3.01	€5.30	+ 76.08%	250.0000	g	€/kg	12.04	21.20	mq	Martinique	2026-03-16 19:58:06.225282
40	Sauce béchamel Maggi Saveur à l'ancienne sachet -60g	https://www.kiprix.com/fr-mq/produit/6646	€0.62	€1.19	+ 91.94%	60.0000	g	€/kg	10.33	19.83	mq	Martinique	2026-03-16 19:58:06.225282
41	Bouillon de poule Knorr 15 tablettes - 150g	https://www.kiprix.com/fr-gp/produit/13762	€1.19	€2.99	+ 151.26%	150.0000	g	€/kg	7.93	19.93	gp	Guadeloupe	2026-03-16 19:58:22.51773
42	Barres céréales Nesquik  Chocolat - 6x25g	https://www.kiprix.com/fr-gp/produit/3527	€1.79	€3.45	+ 92.74%	25.0000	g	€/kg	71.60	138.00	gp	Guadeloupe	2026-03-16 19:58:22.51773
43	Barres de céréales Lion Chocolat caramel - 6x25g	https://www.kiprix.com/fr-gp/produit/3529	€1.81	€3.55	+ 96.13%	25.0000	g	€/kg	72.40	142.00	gp	Guadeloupe	2026-03-16 19:58:22.51773
44	Bonbons menthol ss sucres avec stévia RICOLA boîte	https://www.kiprix.com/fr-gp/produit/58164	€1.95	€2.50	+ 28.21%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:58:22.51773
45	Levure Chimique Alsacienne alsa 8 sachets - 88g	https://www.kiprix.com/fr-gp/produit/4306	€0.80	€1.55	+ 93.75%	88.0000	g	€/kg	9.09	17.61	gp	Guadeloupe	2026-03-16 19:58:22.51773
46	Barres céréales Grany Chocolat - 125g	https://www.kiprix.com/fr-gp/produit/3538	€1.80	€3.30	+ 83.33%	125.0000	g	€/kg	14.40	26.40	gp	Guadeloupe	2026-03-16 19:58:22.51773
47	Biscuits fourrés BN Chocolat - 375g	https://www.kiprix.com/fr-gp/produit/3113	€1.79	€5.95	+ 232.40%	375.0000	g	€/kg	4.77	15.87	gp	Guadeloupe	2026-03-16 19:58:22.51773
48	Bouillon Cube Maggi Volaille - 80g	https://www.kiprix.com/fr-gp/produit/6756	€0.97	€1.89	+ 94.85%	80.0000	g	€/kg	12.12	23.62	gp	Guadeloupe	2026-03-16 19:58:22.51773
49	Biscuit bébé Blédina 10 mois Boudoir - 120g	https://www.kiprix.com/fr-gp/produit/3464	€1.71	€3.47	+ 102.92%	120.0000	g	€/kg	14.25	28.92	gp	Guadeloupe	2026-03-16 19:58:22.51773
50	Purée Mousline Crème et noix de muscade - 500g	https://www.kiprix.com/fr-gp/produit/8806	€3.19	€5.29	+ 65.83%	500.0000	g	€/kg	6.38	10.58	gp	Guadeloupe	2026-03-16 19:58:22.51773
51	Noisettes en poudre Vahiné 100g	https://www.kiprix.com/fr-gp/produit/4427	€2.96	€5.99	+ 102.36%	100.0000	g	€/kg	29.60	59.90	gp	Guadeloupe	2026-03-16 19:58:22.51773
52	Bonbons pastilles eucalyptus sans sucre stévia RICOLA bte	https://www.kiprix.com/fr-gp/produit/55702	€2.02	€2.50	+ 23.76%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:58:22.51773
53	Barres de céréales Chocapic Chocolat - 6x25g	https://www.kiprix.com/fr-gp/produit/3526	€1.77	€3.55	+ 100.56%	25.0000	g	€/kg	70.80	142.00	gp	Guadeloupe	2026-03-16 19:58:22.51773
54	Arôme Saveur Maggi 250g	https://www.kiprix.com/fr-gp/produit/5778	€1.86	€3.95	+ 112.37%	250.0000	g	€/kg	7.44	15.80	gp	Guadeloupe	2026-03-16 19:58:22.51773
55	Biscuits Pocket Petit Ecolier Chocolat au lait - 250g	https://www.kiprix.com/fr-gp/produit/6264	€3.01	€4.80	+ 59.47%	250.0000	g	€/kg	12.04	19.20	gp	Guadeloupe	2026-03-16 19:58:22.51773
56	Sauce béchamel Maggi Saveur à l'ancienne sachet -60g	https://www.kiprix.com/fr-gp/produit/6646	€0.62	€1.35	+ 117.74%	60.0000	g	€/kg	10.33	22.50	gp	Guadeloupe	2026-03-16 19:58:22.51773
57	Croquettes chat Purina One Poulet chat adulte - 450g	https://www.kiprix.com/fr-gp/produit/8245	€2.97	€4.40	+ 48.15%	450.0000	g	€/kg	6.60	9.78	gp	Guadeloupe	2026-03-16 19:58:22.51773
58	Bouillon Cube Maggi Vollaile - x12 cubes - 120g	https://www.kiprix.com/fr-gp/produit/6758	€1.45	€2.40	+ 65.52%	120.0000	g	€/kg	12.08	20.00	gp	Guadeloupe	2026-03-16 19:58:22.51773
59	Croquettes chat Purina One Adulte - Saumon/Céréales - 450g	https://www.kiprix.com/fr-gp/produit/8258	€2.53	€4.14	+ 63.64%	450.0000	g	€/kg	5.62	9.20	gp	Guadeloupe	2026-03-16 19:58:22.51773
60	Biscuits sablés Granola Chocolat au lait - 225g	https://www.kiprix.com/fr-gp/produit/3120	€1.58	€2.99	+ 89.24%	225.0000	g	€/kg	7.02	13.29	gp	Guadeloupe	2026-03-16 19:58:22.51773
61	Chapelure dorée Tipiak 250g	https://www.kiprix.com/fr-gp/produit/7047	€0.67	€1.85	+ 176.12%	250.0000	g	€/kg	2.68	7.40	gp	Guadeloupe	2026-03-16 19:58:22.51773
62	Croquettes chat Purina One Stérilisé - Boeuf/Blé-1.5kg	https://www.kiprix.com/fr-gp/produit/8325	€7.03	€12.31	+ 75.11%	1.5000	kg	€/kg	4.69	8.21	gp	Guadeloupe	2026-03-16 19:58:22.51773
63	boisson végétale lait d'amande  bio bjorg 1l	https://www.kiprix.com/fr-gp/produit/1421	€2.55	€4.75	+ 86.27%	1.0000	l	€/L	2.55	4.75	gp	Guadeloupe	2026-03-16 19:58:22.51773
64	Biscuits petit déjeuner Belvita Miel & pépites chocolat - 650g	https://www.kiprix.com/fr-gp/produit/13214	€4.13	€6.00	+ 45.28%	650.0000	g	€/kg	6.35	9.23	gp	Guadeloupe	2026-03-16 19:58:22.51773
65	Croquettes chaton Purina One Junior - Poulet/Céréales - 450g	https://www.kiprix.com/fr-gp/produit/8235	€2.63	€4.57	+ 73.76%	450.0000	g	€/kg	5.84	10.16	gp	Guadeloupe	2026-03-16 19:58:22.51773
66	Biscuits Mini BN Goûter à la fraise - 175g	https://www.kiprix.com/fr-gp/produit/3309	€2.09	€2.99	+ 43.06%	175.0000	g	€/kg	11.94	17.09	gp	Guadeloupe	2026-03-16 19:58:22.51773
67	Café Soluble NESCAFÉ Spécial Filtre, Flacon 100g	https://www.kiprix.com/fr-gp/produit/11397	€4.98	€8.35	+ 67.67%	100.0000	g	€/kg	49.80	83.50	gp	Guadeloupe	2026-03-16 19:58:22.51773
68	Biscuits Duo Mini BN  190g	https://www.kiprix.com/fr-gp/produit/17044	€1.97	€2.99	+ 51.78%	190.0000	g	€/kg	10.37	15.74	gp	Guadeloupe	2026-03-16 19:58:22.51773
69	boisson végétale gourmande  bjorg  amande noisette bio - 1l	https://www.kiprix.com/fr-gp/produit/1427	€3.06	€4.70	+ 53.59%	1.0000	l	€/L	3.06	4.70	gp	Guadeloupe	2026-03-16 19:58:22.51773
70	Blanchisseur anti grissaille VANISH Blanco, 10 sachets	https://www.kiprix.com/fr-gp/produit/43951	€2.89	€5.43	+ 87.89%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:58:22.51773
71	Lait et céréales bébé biscuité vanille dès 12 mois BLEDIDEJ BLEDINA	https://www.kiprix.com/fr-gp/produit/45217	€3.53	€5.65	+ 60.06%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:58:22.51773
72	Café Soluble NESCAFÉ Cappuccino Original, Boîte 280g	https://www.kiprix.com/fr-gp/produit/11407	€4.23	€6.99	+ 65.25%	280.0000	g	€/kg	15.11	24.96	gp	Guadeloupe	2026-03-16 19:58:22.51773
73	Fromage à tartiner Madame Loïk Fouetté Ech. Ciboulette - 150g	https://www.kiprix.com/fr-gp/produit/14087	€1.59	€3.53	+ 122.01%	150.0000	g	€/kg	10.60	23.53	gp	Guadeloupe	2026-03-16 19:58:22.51773
74	Boisson végétale Noisette Bio  Bjorg- 1L	https://www.kiprix.com/fr-gp/produit/1438	€2.73	€5.40	+ 97.80%	1.0000	l	€/L	2.73	5.40	gp	Guadeloupe	2026-03-16 19:58:22.51773
75	Coloration Casting Crème Gloss Chatain foncé corsé n°300	https://www.kiprix.com/fr-gp/produit/9101	€10.68	€17.60	+ 64.79%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:58:22.51773
76	Café Soluble NESCAFÉ Sélection Flacon 200g	https://www.kiprix.com/fr-gp/produit/11394	€6.11	€12.25	+ 100.49%	200.0000	g	€/kg	30.55	61.25	gp	Guadeloupe	2026-03-16 19:58:22.51773
77	Boisson végétalelait d'amande  chocolat bjorg bio - 1l	https://www.kiprix.com/fr-gp/produit/1425	€2.55	€5.40	+ 111.76%	1.0000	l	€/L	2.55	5.40	gp	Guadeloupe	2026-03-16 19:58:22.51773
78	Café soluble Nescafé Capuccino - x10 - 140g	https://www.kiprix.com/fr-gp/produit/11575	€3.20	€4.90	+ 53.13%	140.0000	g	€/kg	22.86	35.00	gp	Guadeloupe	2026-03-16 19:58:22.51773
79	Gâteaux L'Ourson Lulu LU Fraise - 150g	https://www.kiprix.com/fr-gp/produit/18813	€1.75	€2.70	+ 54.29%	150.0000	g	€/kg	11.67	18.00	gp	Guadeloupe	2026-03-16 19:58:22.51773
80	Fromage à tartiner Madame Loïk Fouetté Ail Fines Herbes - 150g	https://www.kiprix.com/fr-gp/produit/10386	€1.59	€3.48	+ 118.87%	150.0000	g	€/kg	10.60	23.20	gp	Guadeloupe	2026-03-16 19:58:22.51773
81	Bouillon de poule Knorr 15 tablettes - 150g	https://www.kiprix.com/fr-gp/produit/13762	€1.19	€2.99	+ 151.26%	150.0000	g	€/kg	7.93	19.93	gp	Guadeloupe	2026-03-16 19:58:32.685187
82	Barres céréales Nesquik  Chocolat - 6x25g	https://www.kiprix.com/fr-gp/produit/3527	€1.79	€3.45	+ 92.74%	25.0000	g	€/kg	71.60	138.00	gp	Guadeloupe	2026-03-16 19:58:32.685187
83	Barres de céréales Lion Chocolat caramel - 6x25g	https://www.kiprix.com/fr-gp/produit/3529	€1.81	€3.55	+ 96.13%	25.0000	g	€/kg	72.40	142.00	gp	Guadeloupe	2026-03-16 19:58:32.685187
84	Bonbons menthol ss sucres avec stévia RICOLA boîte	https://www.kiprix.com/fr-gp/produit/58164	€1.95	€2.50	+ 28.21%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:58:32.685187
85	Levure Chimique Alsacienne alsa 8 sachets - 88g	https://www.kiprix.com/fr-gp/produit/4306	€0.80	€1.55	+ 93.75%	88.0000	g	€/kg	9.09	17.61	gp	Guadeloupe	2026-03-16 19:58:32.685187
86	Barres céréales Grany Chocolat - 125g	https://www.kiprix.com/fr-gp/produit/3538	€1.80	€3.30	+ 83.33%	125.0000	g	€/kg	14.40	26.40	gp	Guadeloupe	2026-03-16 19:58:32.685187
87	Biscuits fourrés BN Chocolat - 375g	https://www.kiprix.com/fr-gp/produit/3113	€1.79	€5.95	+ 232.40%	375.0000	g	€/kg	4.77	15.87	gp	Guadeloupe	2026-03-16 19:58:32.685187
88	Bouillon Cube Maggi Volaille - 80g	https://www.kiprix.com/fr-gp/produit/6756	€0.97	€1.89	+ 94.85%	80.0000	g	€/kg	12.12	23.62	gp	Guadeloupe	2026-03-16 19:58:32.685187
89	Biscuit bébé Blédina 10 mois Boudoir - 120g	https://www.kiprix.com/fr-gp/produit/3464	€1.71	€3.47	+ 102.92%	120.0000	g	€/kg	14.25	28.92	gp	Guadeloupe	2026-03-16 19:58:32.685187
90	Purée Mousline Crème et noix de muscade - 500g	https://www.kiprix.com/fr-gp/produit/8806	€3.19	€5.29	+ 65.83%	500.0000	g	€/kg	6.38	10.58	gp	Guadeloupe	2026-03-16 19:58:32.685187
91	Noisettes en poudre Vahiné 100g	https://www.kiprix.com/fr-gp/produit/4427	€2.96	€5.99	+ 102.36%	100.0000	g	€/kg	29.60	59.90	gp	Guadeloupe	2026-03-16 19:58:32.685187
92	Bonbons pastilles eucalyptus sans sucre stévia RICOLA bte	https://www.kiprix.com/fr-gp/produit/55702	€2.02	€2.50	+ 23.76%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:58:32.685187
93	Barres de céréales Chocapic Chocolat - 6x25g	https://www.kiprix.com/fr-gp/produit/3526	€1.77	€3.55	+ 100.56%	25.0000	g	€/kg	70.80	142.00	gp	Guadeloupe	2026-03-16 19:58:32.685187
94	Arôme Saveur Maggi 250g	https://www.kiprix.com/fr-gp/produit/5778	€1.86	€3.95	+ 112.37%	250.0000	g	€/kg	7.44	15.80	gp	Guadeloupe	2026-03-16 19:58:32.685187
95	Biscuits Pocket Petit Ecolier Chocolat au lait - 250g	https://www.kiprix.com/fr-gp/produit/6264	€3.01	€4.80	+ 59.47%	250.0000	g	€/kg	12.04	19.20	gp	Guadeloupe	2026-03-16 19:58:32.685187
96	Sauce béchamel Maggi Saveur à l'ancienne sachet -60g	https://www.kiprix.com/fr-gp/produit/6646	€0.62	€1.35	+ 117.74%	60.0000	g	€/kg	10.33	22.50	gp	Guadeloupe	2026-03-16 19:58:32.685187
97	Croquettes chat Purina One Poulet chat adulte - 450g	https://www.kiprix.com/fr-gp/produit/8245	€2.97	€4.40	+ 48.15%	450.0000	g	€/kg	6.60	9.78	gp	Guadeloupe	2026-03-16 19:58:32.685187
98	Bouillon Cube Maggi Vollaile - x12 cubes - 120g	https://www.kiprix.com/fr-gp/produit/6758	€1.45	€2.40	+ 65.52%	120.0000	g	€/kg	12.08	20.00	gp	Guadeloupe	2026-03-16 19:58:32.685187
99	Croquettes chat Purina One Adulte - Saumon/Céréales - 450g	https://www.kiprix.com/fr-gp/produit/8258	€2.53	€4.14	+ 63.64%	450.0000	g	€/kg	5.62	9.20	gp	Guadeloupe	2026-03-16 19:58:32.685187
100	Biscuits sablés Granola Chocolat au lait - 225g	https://www.kiprix.com/fr-gp/produit/3120	€1.58	€2.99	+ 89.24%	225.0000	g	€/kg	7.02	13.29	gp	Guadeloupe	2026-03-16 19:58:32.685187
101	Bouillon de poule Knorr 15 tablettes - 150g	https://www.kiprix.com/fr-gp/produit/13762	€1.19	€2.99	+ 151.26%	150.0000	g	€/kg	7.93	19.93	gp	Guadeloupe	2026-03-16 19:59:01.966728
102	Barres céréales Nesquik  Chocolat - 6x25g	https://www.kiprix.com/fr-gp/produit/3527	€1.79	€3.45	+ 92.74%	25.0000	g	€/kg	71.60	138.00	gp	Guadeloupe	2026-03-16 19:59:01.966728
103	Barres de céréales Lion Chocolat caramel - 6x25g	https://www.kiprix.com/fr-gp/produit/3529	€1.81	€3.55	+ 96.13%	25.0000	g	€/kg	72.40	142.00	gp	Guadeloupe	2026-03-16 19:59:01.966728
104	Bonbons menthol ss sucres avec stévia RICOLA boîte	https://www.kiprix.com/fr-gp/produit/58164	€1.95	€2.50	+ 28.21%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:59:01.966728
105	Levure Chimique Alsacienne alsa 8 sachets - 88g	https://www.kiprix.com/fr-gp/produit/4306	€0.80	€1.55	+ 93.75%	88.0000	g	€/kg	9.09	17.61	gp	Guadeloupe	2026-03-16 19:59:01.966728
106	Barres céréales Grany Chocolat - 125g	https://www.kiprix.com/fr-gp/produit/3538	€1.80	€3.30	+ 83.33%	125.0000	g	€/kg	14.40	26.40	gp	Guadeloupe	2026-03-16 19:59:01.966728
107	Biscuits fourrés BN Chocolat - 375g	https://www.kiprix.com/fr-gp/produit/3113	€1.79	€5.95	+ 232.40%	375.0000	g	€/kg	4.77	15.87	gp	Guadeloupe	2026-03-16 19:59:01.966728
108	Bouillon Cube Maggi Volaille - 80g	https://www.kiprix.com/fr-gp/produit/6756	€0.97	€1.89	+ 94.85%	80.0000	g	€/kg	12.12	23.62	gp	Guadeloupe	2026-03-16 19:59:01.966728
109	Biscuit bébé Blédina 10 mois Boudoir - 120g	https://www.kiprix.com/fr-gp/produit/3464	€1.71	€3.47	+ 102.92%	120.0000	g	€/kg	14.25	28.92	gp	Guadeloupe	2026-03-16 19:59:01.966728
110	Purée Mousline Crème et noix de muscade - 500g	https://www.kiprix.com/fr-gp/produit/8806	€3.19	€5.29	+ 65.83%	500.0000	g	€/kg	6.38	10.58	gp	Guadeloupe	2026-03-16 19:59:01.966728
111	Noisettes en poudre Vahiné 100g	https://www.kiprix.com/fr-gp/produit/4427	€2.96	€5.99	+ 102.36%	100.0000	g	€/kg	29.60	59.90	gp	Guadeloupe	2026-03-16 19:59:01.966728
112	Bonbons pastilles eucalyptus sans sucre stévia RICOLA bte	https://www.kiprix.com/fr-gp/produit/55702	€2.02	€2.50	+ 23.76%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:59:01.966728
113	Barres de céréales Chocapic Chocolat - 6x25g	https://www.kiprix.com/fr-gp/produit/3526	€1.77	€3.55	+ 100.56%	25.0000	g	€/kg	70.80	142.00	gp	Guadeloupe	2026-03-16 19:59:01.966728
114	Arôme Saveur Maggi 250g	https://www.kiprix.com/fr-gp/produit/5778	€1.86	€3.95	+ 112.37%	250.0000	g	€/kg	7.44	15.80	gp	Guadeloupe	2026-03-16 19:59:01.966728
115	Biscuits Pocket Petit Ecolier Chocolat au lait - 250g	https://www.kiprix.com/fr-gp/produit/6264	€3.01	€4.80	+ 59.47%	250.0000	g	€/kg	12.04	19.20	gp	Guadeloupe	2026-03-16 19:59:01.966728
116	Sauce béchamel Maggi Saveur à l'ancienne sachet -60g	https://www.kiprix.com/fr-gp/produit/6646	€0.62	€1.35	+ 117.74%	60.0000	g	€/kg	10.33	22.50	gp	Guadeloupe	2026-03-16 19:59:01.966728
117	Croquettes chat Purina One Poulet chat adulte - 450g	https://www.kiprix.com/fr-gp/produit/8245	€2.97	€4.40	+ 48.15%	450.0000	g	€/kg	6.60	9.78	gp	Guadeloupe	2026-03-16 19:59:01.966728
118	Bouillon Cube Maggi Vollaile - x12 cubes - 120g	https://www.kiprix.com/fr-gp/produit/6758	€1.45	€2.40	+ 65.52%	120.0000	g	€/kg	12.08	20.00	gp	Guadeloupe	2026-03-16 19:59:01.966728
119	Croquettes chat Purina One Adulte - Saumon/Céréales - 450g	https://www.kiprix.com/fr-gp/produit/8258	€2.53	€4.14	+ 63.64%	450.0000	g	€/kg	5.62	9.20	gp	Guadeloupe	2026-03-16 19:59:01.966728
120	Biscuits sablés Granola Chocolat au lait - 225g	https://www.kiprix.com/fr-gp/produit/3120	€1.58	€2.99	+ 89.24%	225.0000	g	€/kg	7.02	13.29	gp	Guadeloupe	2026-03-16 19:59:01.966728
121	Chapelure dorée Tipiak 250g	https://www.kiprix.com/fr-gp/produit/7047	€0.67	€1.85	+ 176.12%	250.0000	g	€/kg	2.68	7.40	gp	Guadeloupe	2026-03-16 19:59:01.966728
122	Croquettes chat Purina One Stérilisé - Boeuf/Blé-1.5kg	https://www.kiprix.com/fr-gp/produit/8325	€7.03	€12.31	+ 75.11%	1.5000	kg	€/kg	4.69	8.21	gp	Guadeloupe	2026-03-16 19:59:01.966728
123	boisson végétale lait d'amande  bio bjorg 1l	https://www.kiprix.com/fr-gp/produit/1421	€2.55	€4.75	+ 86.27%	1.0000	l	€/L	2.55	4.75	gp	Guadeloupe	2026-03-16 19:59:01.966728
124	Biscuits petit déjeuner Belvita Miel & pépites chocolat - 650g	https://www.kiprix.com/fr-gp/produit/13214	€4.13	€6.00	+ 45.28%	650.0000	g	€/kg	6.35	9.23	gp	Guadeloupe	2026-03-16 19:59:01.966728
125	Croquettes chaton Purina One Junior - Poulet/Céréales - 450g	https://www.kiprix.com/fr-gp/produit/8235	€2.63	€4.57	+ 73.76%	450.0000	g	€/kg	5.84	10.16	gp	Guadeloupe	2026-03-16 19:59:01.966728
126	Biscuits Mini BN Goûter à la fraise - 175g	https://www.kiprix.com/fr-gp/produit/3309	€2.09	€2.99	+ 43.06%	175.0000	g	€/kg	11.94	17.09	gp	Guadeloupe	2026-03-16 19:59:01.966728
127	Café Soluble NESCAFÉ Spécial Filtre, Flacon 100g	https://www.kiprix.com/fr-gp/produit/11397	€4.98	€8.35	+ 67.67%	100.0000	g	€/kg	49.80	83.50	gp	Guadeloupe	2026-03-16 19:59:01.966728
128	Biscuits Duo Mini BN  190g	https://www.kiprix.com/fr-gp/produit/17044	€1.97	€2.99	+ 51.78%	190.0000	g	€/kg	10.37	15.74	gp	Guadeloupe	2026-03-16 19:59:01.966728
129	boisson végétale gourmande  bjorg  amande noisette bio - 1l	https://www.kiprix.com/fr-gp/produit/1427	€3.06	€4.70	+ 53.59%	1.0000	l	€/L	3.06	4.70	gp	Guadeloupe	2026-03-16 19:59:01.966728
130	Blanchisseur anti grissaille VANISH Blanco, 10 sachets	https://www.kiprix.com/fr-gp/produit/43951	€2.89	€5.43	+ 87.89%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:59:01.966728
131	Lait et céréales bébé biscuité vanille dès 12 mois BLEDIDEJ BLEDINA	https://www.kiprix.com/fr-gp/produit/45217	€3.53	€5.65	+ 60.06%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:59:01.966728
132	Café Soluble NESCAFÉ Cappuccino Original, Boîte 280g	https://www.kiprix.com/fr-gp/produit/11407	€4.23	€6.99	+ 65.25%	280.0000	g	€/kg	15.11	24.96	gp	Guadeloupe	2026-03-16 19:59:01.966728
133	Fromage à tartiner Madame Loïk Fouetté Ech. Ciboulette - 150g	https://www.kiprix.com/fr-gp/produit/14087	€1.59	€3.53	+ 122.01%	150.0000	g	€/kg	10.60	23.53	gp	Guadeloupe	2026-03-16 19:59:01.966728
134	Boisson végétale Noisette Bio  Bjorg- 1L	https://www.kiprix.com/fr-gp/produit/1438	€2.73	€5.40	+ 97.80%	1.0000	l	€/L	2.73	5.40	gp	Guadeloupe	2026-03-16 19:59:01.966728
135	Coloration Casting Crème Gloss Chatain foncé corsé n°300	https://www.kiprix.com/fr-gp/produit/9101	€10.68	€17.60	+ 64.79%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-16 19:59:01.966728
136	Café Soluble NESCAFÉ Sélection Flacon 200g	https://www.kiprix.com/fr-gp/produit/11394	€6.11	€12.25	+ 100.49%	200.0000	g	€/kg	30.55	61.25	gp	Guadeloupe	2026-03-16 19:59:01.966728
137	Boisson végétalelait d'amande  chocolat bjorg bio - 1l	https://www.kiprix.com/fr-gp/produit/1425	€2.55	€5.40	+ 111.76%	1.0000	l	€/L	2.55	5.40	gp	Guadeloupe	2026-03-16 19:59:01.966728
138	Café soluble Nescafé Capuccino - x10 - 140g	https://www.kiprix.com/fr-gp/produit/11575	€3.20	€4.90	+ 53.13%	140.0000	g	€/kg	22.86	35.00	gp	Guadeloupe	2026-03-16 19:59:01.966728
139	Gâteaux L'Ourson Lulu LU Fraise - 150g	https://www.kiprix.com/fr-gp/produit/18813	€1.75	€2.70	+ 54.29%	150.0000	g	€/kg	11.67	18.00	gp	Guadeloupe	2026-03-16 19:59:01.966728
140	Fromage à tartiner Madame Loïk Fouetté Ail Fines Herbes - 150g	https://www.kiprix.com/fr-gp/produit/10386	€1.59	€3.48	+ 118.87%	150.0000	g	€/kg	10.60	23.20	gp	Guadeloupe	2026-03-16 19:59:01.966728
141	U BIO\nJus de citron vert	https://www.kiprix.com/fr-gp/produit/42656	1,94 €	2,45 €	+ 26,29%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
142	Tourteau fromagé pasteurisé l'Original vache LES P'TITS AMOUREUX, 10,8%mg	https://www.kiprix.com/fr-gp/produit/63980	2,49 €	3,60 €	+ 44,58%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
143	Vin blanc Pays d'OC IGP Charonnay Roche Mazet, bouteille de	https://www.kiprix.com/fr-gp/produit/59149	2,14 €	2,70 €	+ 26,17%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
144	U BIO\nCafé capsules Bio ESPRESSO Pérou N°6 - compatible NESPRESSO	https://www.kiprix.com/fr-gp/produit/42665	3,15 €	3,73 €	+ 18,41%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
145	U\nMix barbecue à la provençale	https://www.kiprix.com/fr-gp/produit/53493	0,99 €	1,45 €	+ 46,46%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
146	U\nSirop de menthe verte  bidon de	https://www.kiprix.com/fr-gp/produit/60546	1,89 €	4,40 €	+ 132,80%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
147	U BIO\nInfusion Bio Verveine U BIO - 20 sachets	https://www.kiprix.com/fr-gp/produit/42677	1,65 €	1,99 €	+ 20,61%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
148	U\nMoutarde douce bouteille de	https://www.kiprix.com/fr-gp/produit/54075	1,89 €	2,45 €	+ 29,63%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
149	U SPECIALISTE\nPile U SPECIALISTE LR3	https://www.kiprix.com/fr-gp/produit/82300	4,64 €	5,35 €	+ 15,30%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
150	U\nSauce samouraï	https://www.kiprix.com/fr-gp/produit/53888	1,47 €	1,75 €	+ 19,05%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
151	Nettoyant four Decapfour  Express - 500ml	https://www.kiprix.com/fr-gp/produit/1530	3,15 €	4,90 €	+ 55,56%	500.0000	ml	€/L	6.30	9.80	gp	Guadeloupe	2026-03-19 00:45:34.79404
152	Assortiment Confiserie Chocolat LANVIN assortiment lait et noir	https://www.kiprix.com/fr-gp/produit/68807	13,75 €	16,90 €	+ 22,91%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
153	Jambon Label Rouge Fleury Michon sans nitrite x4- 160g	https://www.kiprix.com/fr-gp/produit/3962	4,00 €	5,50 €	+ 37,50%	160.0000	g	€/kg	25.00	34.38	gp	Guadeloupe	2026-03-19 00:45:34.79404
154	Tablette chocolat Côte d'Or Chocolat lait/Noisettes - 200g	https://www.kiprix.com/fr-gp/produit/17115	4,25 €	5,99 €	+ 40,94%	200.0000	g	€/kg	21.25	29.95	gp	Guadeloupe	2026-03-19 00:45:34.79404
155	Tablette de chocolat Equador Noir 72% cacao 100g	https://www.kiprix.com/fr-gp/produit/765	1,39 €	2,00 €	+ 43,88%	100.0000	g	€/kg	13.90	20.00	gp	Guadeloupe	2026-03-19 00:45:34.79404
156	Soda à l'orange ORANGINA - le pack de 6 canettes de	https://www.kiprix.com/fr-gp/produit/68815	3,62 €	5,29 €	+ 46,13%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
157	U\nOeufs Plein Air Bleu Blanc Coeur - Boîte de	https://www.kiprix.com/fr-gp/produit/64017	2,99 €	4,50 €	+ 50,50%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
158	Knacki Original Herta 140g	https://www.kiprix.com/fr-gp/produit/4320	1,04 €	2,20 €	+ 111,54%	140.0000	g	€/kg	7.43	15.71	gp	Guadeloupe	2026-03-19 00:45:34.79404
159	U\nBûchettes glacées vanille-chocolat, vanille-framboise et vanille crèmebrûlée, 6 pièces	https://www.kiprix.com/fr-gp/produit/68904	2,99 €	3,95 €	+ 32,11%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
160	Pains Burger Géant à la farine complète Sans Additifs JACQUETx4	https://www.kiprix.com/fr-gp/produit/68817	1,15 €	2,49 €	+ 116,52%	\N	\N	\N	\N	\N	gp	Guadeloupe	2026-03-19 00:45:34.79404
\.


--
-- Data for Name: scrape_logs; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.scrape_logs (id, territory, pages, status, nb_produits, message, started_at, finished_at) FROM stdin;
1	mq	1	error	0	nts/poo-2026/groupe_scp2/main.py", line 2, in <module>\n    from src.cli import cli\n  File "/Users/user/Documents/poo-2026/groupe_scp2/src/cli.py", line 16, in <module>\n    from .manager import ScraperManager\n  File "/Users/user/Documents/poo-2026/groupe_scp2/src/manager.py", line 10, in <module>\n    from .base_scraper import BaseScraper\n  File "/Users/user/Documents/poo-2026/groupe_scp2/src/base_scraper.py", line 9, in <module>\n    import requests\nModuleNotFoundError: No module named 'requests'\n	2026-03-19 00:33:12.774214	2026-03-19 00:33:13.079142
2	mq	1	success	0	Scraping Kiprix (mq) — 1 page(s)...\n✗ Erreur lors de la sauvegarde en base : No module named 'psycopg2'\n✓ 20 produits scrapés.\n	2026-03-19 00:38:13.539817	2026-03-19 00:42:33.369092
3	gp	1	success	0	Scraping Kiprix (gp) — 1 page(s)...\n✓ Données insérées dans PostgreSQL.\n✓ 20 produits scrapés.\n	2026-03-19 00:44:50.136955	2026-03-19 00:45:35.037376
\.


--
-- Data for Name: scrape_urls; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.scrape_urls (id, url, label, actif, created_at, last_scraped_at, nb_donnees) FROM stdin;
1	https://www.kiprix.com/fr-mq	Martinique 	t	2026-03-19 01:01:27.244567	\N	0
\.


--
-- Name: produits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: laravel
--

SELECT pg_catalog.setval('public.produits_id_seq', 160, true);


--
-- Name: scrape_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: laravel
--

SELECT pg_catalog.setval('public.scrape_logs_id_seq', 3, true);


--
-- Name: scrape_urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: laravel
--

SELECT pg_catalog.setval('public.scrape_urls_id_seq', 1, true);


--
-- Name: produits produits_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_pkey PRIMARY KEY (id);


--
-- Name: scrape_logs scrape_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.scrape_logs
    ADD CONSTRAINT scrape_logs_pkey PRIMARY KEY (id);


--
-- Name: scrape_urls scrape_urls_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.scrape_urls
    ADD CONSTRAINT scrape_urls_pkey PRIMARY KEY (id);


--
-- Name: scrape_urls scrape_urls_url_key; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.scrape_urls
    ADD CONSTRAINT scrape_urls_url_key UNIQUE (url);


--
-- PostgreSQL database dump complete
--

\unrestrict g8RzaNgQNaZaPKNHeCypbOml03LSgHERBpYhFdtqlrkT0GucdrU1qgTm0th71WY

