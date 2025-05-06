--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-07 01:48:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 222 (class 1259 OID 18759)
-- Name: accident_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accident_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.accident_types OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18758)
-- Name: accident_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accident_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accident_types_id_seq OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 221
-- Name: accident_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accident_types_id_seq OWNED BY public.accident_types.id;


--
-- TOC entry 228 (class 1259 OID 18786)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    service_id integer,
    phone_number character varying(20) NOT NULL,
    address character varying(255),
    description text
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18785)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 227
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 230 (class 1259 OID 18800)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    address character varying(255) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18799)
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO postgres;

--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 229
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- TOC entry 224 (class 1259 OID 18768)
-- Name: priorities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.priorities (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    number integer NOT NULL
);


ALTER TABLE public.priorities OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18767)
-- Name: priorities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.priorities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.priorities_id_seq OWNER TO postgres;

--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 223
-- Name: priorities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.priorities_id_seq OWNED BY public.priorities.id;


--
-- TOC entry 232 (class 1259 OID 18807)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    location_id integer NOT NULL,
    accident_type_id integer NOT NULL,
    priority_id integer NOT NULL,
    applicant character varying(100) NOT NULL,
    phone_number character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18806)
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_id_seq OWNER TO postgres;

--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 231
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- TOC entry 218 (class 1259 OID 18736)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 18735)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 234 (class 1259 OID 18835)
-- Name: routed_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routed_requests (
    id integer NOT NULL,
    request_id integer,
    service_id integer NOT NULL,
    applicant character varying(100) NOT NULL,
    phone_number character varying(20) NOT NULL,
    address character varying(255) NOT NULL,
    accident_type character varying(100) NOT NULL,
    priority character varying(50) NOT NULL,
    routed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.routed_requests OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18834)
-- Name: routed_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.routed_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.routed_requests_id_seq OWNER TO postgres;

--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 233
-- Name: routed_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.routed_requests_id_seq OWNED BY public.routed_requests.id;


--
-- TOC entry 226 (class 1259 OID 18777)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18776)
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 225
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- TOC entry 220 (class 1259 OID 18745)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18744)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4784 (class 2604 OID 18762)
-- Name: accident_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accident_types ALTER COLUMN id SET DEFAULT nextval('public.accident_types_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 18789)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 18803)
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 18771)
-- Name: priorities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.priorities ALTER COLUMN id SET DEFAULT nextval('public.priorities_id_seq'::regclass);


--
-- TOC entry 4789 (class 2604 OID 18810)
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 18739)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 18838)
-- Name: routed_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routed_requests ALTER COLUMN id SET DEFAULT nextval('public.routed_requests_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 18780)
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 18748)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4978 (class 0 OID 18759)
-- Dependencies: 222
-- Data for Name: accident_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accident_types (id, name) FROM stdin;
1	Кража
2	Нападение
3	Вандализм
4	Нарушение общественного порядка
5	Дорожно-транспортное происшествие
6	Мошенничество
7	Хулиганство
8	Угроза жизни
9	Незаконное проникновение
10	Похищение
11	Наводнение
12	Обрушение здания
13	Химическая утечка
14	Поиск пропавших
15	Землетрясение
16	Сель
17	Оползень
18	Радиационная авария
19	Техногенная катастрофа
20	Эвакуация
21	Травма
22	Сердечный приступ
23	Отравление
24	Эпидемия
25	Кровотечение
26	Аллергическая реакция
27	Судороги
28	Потеря сознания
29	Перелом
30	Ожог
31	Пожар
32	Задымление
33	Возгорание техники
34	Лесной пожар
35	Взрыв газа
36	Короткое замыкание
37	Пожар в транспорте
38	Пожар в жилом доме
39	Химический пожар
41	Семейное насилие
44	Злоупотребление алкоголем
45	Наркотическая зависимость
46	Психологический кризис
48	Социальная изоляция
49	Прорыв трубы
50	Отключение электричества
51	Поломка лифта
52	Засор канализации
53	Авария теплоснабжения
54	Утечка газа
55	Повреждение кровли
56	Отсутствие водоснабжения
57	Авария канализации
59	Неуточнённое происшествие
58	Срочный вызов
60	Другое
\.


--
-- TOC entry 4984 (class 0 OID 18786)
-- Dependencies: 228
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, service_id, phone_number, address, description) FROM stdin;
1	1	+7 (846) 956-07-66	г. Самара, просп. Кирова, 223	Для срочных случаев или отсутствия подходящего пункта в заявке
2	2	+7 (846) 338-96-06	г. Самара, ул. Галактионовская, 193	Для чрезвычайных ситуаций, требующих немедленного реагирования
3	3	+7 (846) 266-92-35	г. Самара, ул. Больничная, 2	Скорая помощь и медицинские консультации
4	4	+7 (846) 338-04-01	г. Самара, ул. Чернореченская, 55	Для сообщений о пожарах и задымлениях
5	5	+7 (846) 337-64-56	г. Самара, ул. Первомайская, 26	Поддержка уязвимых групп населения
6	6	+7 (846) 333-03-39	г. Самара, ул. Некрасовская, 62	Для жалоб на коммунальные услуги
7	7	102	г. Самара, ул. Мориса Тореза, 12	Единый центр подачи заявок для неуточнённых или срочных случаев
\.


--
-- TOC entry 4986 (class 0 OID 18800)
-- Dependencies: 230
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, address, latitude, longitude) FROM stdin;
1	Абоба	53.20106245054251	50.12139128108212
2	акак	53.19440268311081	50.10994675009212
3	frr	53.18793779780913	50.084114839249914
4	frfr	53.19812444078073	50.06547664976712
5	frfrf	53.2018458878934	50.07528620884112
6	frfrf	53.19929966885127	50.11975633012165
7	акак	53.19832031645555	50.10896582142692
8	акак	53.1934232125559	50.11125468990495
9	акак	53.18950513167118	50.09882923024976
10	ааааа	53.18676225824743	50.10896582142692
11	акакакакакаакакак	53.19871206512005	50.12106429089003
12	акакакакакаакакак	53.19871206512005	50.12106429089003
13	акакакакакаакакак	53.19871206512005	50.12106429089003
14	4343	53.198709002243845	50.11387061144168
15	4343	53.19498729532674	50.12106429089003
16	frfr	53.19616260312915	50.12106429089003
17	акак	53.18832657773578	50.07822909961441
\.


--
-- TOC entry 4980 (class 0 OID 18768)
-- Dependencies: 224
-- Data for Name: priorities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.priorities (id, name, number) FROM stdin;
1	Незамедлительно	1
2	Высокий	2
3	Средний	3
4	Низкий	4
\.


--
-- TOC entry 4988 (class 0 OID 18807)
-- Dependencies: 232
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, user_id, location_id, accident_type_id, priority_id, applicant, phone_number, created_at) FROM stdin;
13	1	15	12	1	4343	4343	2025-05-07 01:15:10.359618
14	1	16	15	1	4343fr	4343	2025-05-07 01:15:29.284285
\.


--
-- TOC entry 4974 (class 0 OID 18736)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	user
\.


--
-- TOC entry 4990 (class 0 OID 18835)
-- Dependencies: 234
-- Data for Name: routed_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routed_requests (id, request_id, service_id, applicant, phone_number, address, accident_type, priority, routed_at) FROM stdin;
1	1	4	акак	акакак	Абоба	Другое	Средний	2025-05-07 00:38:17.309835
2	4	4	fr	frfr	frfr	Химическая утечка	Незамедлительно	2025-05-07 01:00:27.739954
3	5	6	rf	rfrfr	frfrf	Химическая утечка	Высокий	2025-05-07 01:00:30.139264
4	6	5	rf	rfrfr	frfrf	Похищение	Незамедлительно	2025-05-07 01:00:32.187346
5	7	3	ак	акак	акак	Химическая утечка	Незамедлительно	2025-05-07 01:00:33.960519
6	8	3	ак	акак	акак	Обрушение здания	Незамедлительно	2025-05-07 01:00:35.815634
7	9	3	ак	акак	акак	Обрушение здания	Высокий	2025-05-07 01:00:37.522394
8	10	3	а	а	ааааа	Поиск пропавших	Высокий	2025-05-07 01:00:39.431999
9	11	4	акакакакакакакаака	акакакакаааааааааа	акакакакакаакакак	Химическая утечка	Высокий	2025-05-07 01:01:43.475961
10	12	3	4343	4343	4343	Химическая утечка	Незамедлительно	2025-05-07 01:18:00.87787
11	15	5	ак	ак	акак	Химическая утечка	Незамедлительно	2025-05-07 01:18:45.196326
\.


--
-- TOC entry 4982 (class 0 OID 18777)
-- Dependencies: 226
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name) FROM stdin;
1	Полиция
2	МЧС
3	Больница
4	Пожарные
5	Соцслужба
6	ЖКХ
7	Другое
\.


--
-- TOC entry 4976 (class 0 OID 18745)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role_id) FROM stdin;
1	admin	admin	1
2	user	user	2
\.


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 221
-- Name: accident_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accident_types_id_seq', 60, true);


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 227
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 7, true);


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 229
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 17, true);


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 223
-- Name: priorities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.priorities_id_seq', 4, true);


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 231
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 15, true);


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 233
-- Name: routed_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.routed_requests_id_seq', 11, true);


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 225
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 7, true);


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4802 (class 2606 OID 18766)
-- Name: accident_types accident_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accident_types
    ADD CONSTRAINT accident_types_name_key UNIQUE (name);


--
-- TOC entry 4804 (class 2606 OID 18764)
-- Name: accident_types accident_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accident_types
    ADD CONSTRAINT accident_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 18793)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 4816 (class 2606 OID 18805)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 18775)
-- Name: priorities priorities_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.priorities
    ADD CONSTRAINT priorities_number_key UNIQUE (number);


--
-- TOC entry 4808 (class 2606 OID 18773)
-- Name: priorities priorities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.priorities
    ADD CONSTRAINT priorities_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 18813)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 18743)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4796 (class 2606 OID 18741)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 18843)
-- Name: routed_requests routed_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routed_requests
    ADD CONSTRAINT routed_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 18784)
-- Name: services services_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_name_key UNIQUE (name);


--
-- TOC entry 4812 (class 2606 OID 18782)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 18750)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 18752)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4822 (class 2606 OID 18794)
-- Name: contacts contacts_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- TOC entry 4823 (class 2606 OID 18824)
-- Name: requests requests_accident_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_accident_type_id_fkey FOREIGN KEY (accident_type_id) REFERENCES public.accident_types(id) ON DELETE RESTRICT;


--
-- TOC entry 4824 (class 2606 OID 18819)
-- Name: requests requests_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE RESTRICT;


--
-- TOC entry 4825 (class 2606 OID 18829)
-- Name: requests requests_priority_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_priority_id_fkey FOREIGN KEY (priority_id) REFERENCES public.priorities(id) ON DELETE RESTRICT;


--
-- TOC entry 4826 (class 2606 OID 18814)
-- Name: requests requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 18844)
-- Name: routed_requests routed_requests_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routed_requests
    ADD CONSTRAINT routed_requests_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE RESTRICT;


--
-- TOC entry 4821 (class 2606 OID 18753)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE RESTRICT;


-- Completed on 2025-05-07 01:48:05

--
-- PostgreSQL database dump complete
--

