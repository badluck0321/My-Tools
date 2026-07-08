package com.example.BackEnd_MyTools.bootstrap;

import com.example.BackEnd_MyTools.Entitys.*;
import com.example.BackEnd_MyTools.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AllEntitiesSeeder {
        private final LookupRepository lookupRepository;
        private final UserProfileRepo userProfileRepo;
        private final StoreRepo storeRepo;
        private final ProductRepo productRepo;
        private final MasteryRepo masteryRepo;
        private final DemandeRepo demandeRepo;
        private final QuestionRepo questionRepo;
        private final AnswerRepo answerRepo;
        private final CartRepo cartRepo;
        private final OrderRepo orderRepo;
        private final BookingRepo bookingRepo;
        private final PaymentRepo paymentRepo;
        private final ReviewRepo reviewRepo;
        private final FavoriteRepo favoriteRepo;
        private final ConversationRepo conversationRepo;
        private final ChatMessageRepo chatMessageRepo;
        private final NotificationRepo notificationRepo;
        private final VendorVerificationRepo vendorVerificationRepo;

        @Value("${mytools.seed.cloudinary-base-url:https://res.cloudinary.com/dkmhbowlx/image/upload}")
        private String cloudinaryBaseUrl;

        public void seedAll() {
                seedLookups();
                seedUsers();
                seedStores();
                seedProducts();
                seedMasteries();
                seedDemandes();
                seedForum();
                seedCommerce();
                seedReviewsAndFavorites();
                seedMessaging();
                seedNotifications();
                seedVendorVerifications();
                System.out.println("[Seeder] All demo entities seeded successfully.");
        }

        private void seedLookups() {
                if (lookupRepository.count() > 0)
                        return;
                List<Lookups> items = new ArrayList<>();
                for (String[] row : List.of(
                                new String[] { "CATEGORY", "1", "Construction Tools" },
                                new String[] { "CATEGORY", "2", "Heavy Equipment" },
                                new String[] { "CATEGORY", "3", "Painting & Finishing" },
                                new String[] { "CATEGORY", "4", "Measurement" },
                                new String[] { "CATEGORY", "5", "Transport" },
                                new String[] { "CATEGORY", "6", "IT & Electronics" },
                                new String[] { "MASTERY_TYPE", "1", "Repair & Maintenance" },
                                new String[] { "MASTERY_TYPE", "2", "Installation" },
                                new String[] { "MASTERY_TYPE", "3", "Gardening" },
                                new String[] { "MASTERY_TYPE", "4", "Education & Tutoring" },
                                new String[] { "MASTERY_TYPE", "5", "Digital Services" },
                                new String[] { "MARK", "1", "Bosch" }, new String[] { "MARK", "2", "Makita" },
                                new String[] { "MARK", "3", "DeWalt" }, new String[] { "MARK", "4", "Stanley" },
                                new String[] { "MARK", "5", "Hilti" },
                                new String[] { "CONDITION", "1", "New" },
                                new String[] { "CONDITION", "2", "Used - Good" },
                                new String[] { "CONDITION", "3", "Refurbished" },
                                new String[] { "LISTING_TYPE", "0", "Sale" },
                                new String[] { "LISTING_TYPE", "1", "Rent" },
                                new String[] { "LISTING_TYPE", "2", "Sale and Rent" },
                                new String[] { "PRICING_TYPE", "FIXED", "Fixed Price" },
                                new String[] { "PRICING_TYPE", "PER_HOUR", "Per Hour" },
                                new String[] { "MASTERY_STATUS", "ACTIVE", "Active" },
                                new String[] { "MASTERY_STATUS", "PAUSED", "Paused" },
                                new String[] { "MASTERY_STATUS", "UNAVAILABLE", "Unavailable" },
                                new String[] { "CURRENCY", "MAD", "Moroccan Dirham" },
                                new String[] { "CURRENCY", "EUR", "Euro" },
                                new String[] { "CURRENCY", "USD", "US Dollar" },
                                new String[] { "CURRENCY", "GBP", "British Pound Sterling" },
                                new String[] { "CURRENCY", "JPY", "Japanese Yen" },
                                new String[] { "CURRENCY", "INR", "Indian Rupee" },
                                new String[] { "CURRENCY", "RUB", "Russian Ruble" },
                                new String[] { "CURRENCY", "KRW", "South Korean Won" },
                                new String[] { "CURRENCY", "ILS", "Israeli New Shekel" },
                                new String[] { "CURRENCY", "VND", "Vietnamese Dong" },
                                new String[] { "CURRENCY", "NGN", "Nigerian Naira" },
                                new String[] { "CURRENCY", "UAH", "Ukrainian Hryvnia" },
                                new String[] { "CURRENCY", "PHP", "Philippine Peso" })) {
                        Lookups l = new Lookups();
                        l.setId(row[0] + "_" + row[1]);
                        l.setType(row[0]);
                        l.setCode(row[1]);
                        l.setValue(row[2]);
                        l.setActive(true);
                        items.add(l);
                }
                lookupRepository.saveAll(items);
        }

        private void seedUsers() {
                if (userProfileRepo.count() > 0)
                        return;
                userProfileRepo.saveAll(List.of(
                                user("U001", "yassine", "Yassine", "El Ouardi", "Rabat",
                                                "Store owner for construction tools"),
                                user("U002", "salma", "Salma", "Raji", "Casablanca",
                                                "Frequent customer and service buyer"),
                                user("U003", "mehdi", "Mehdi", "Alaoui", "Marrakech", "Professional technician"),
                                user("U004", "amina", "Amina", "Bennani", "Tangier",
                                                "Gardening and decoration provider"),
                                user("U005", "admin", "Admin", "MyTools", "Rabat", "Platform administrator")));
        }

        private UserProfile user(String id, String username, String first, String last, String city, String bio) {
                UserProfile u = new UserProfile();
                u.setId(id);
                u.setUserId(id);
                u.setUsername(username);
                u.setEmail(username + "@mytools.demo");
                u.setFirstName(first);
                u.setLastName(last);
                u.setPhone("060000" + id.substring(1));
                u.setCity(city);
                u.setAddress(city + ", Morocco");
                u.setBio(bio);
                u.setAvatarPhotoId(cloudinaryImage("v1780396918/developper_ipzv8s.png"));
                u.setCreatedAt(LocalDateTime.now().minusDays(30));
                u.setUpdatedAt(LocalDateTime.now().minusDays(1));
                return u;
        }

        private void seedStores() {
                if (storeRepo.count() > 0)
                        return;
                Store s1 = new Store();
                s1.setId("S001");
                s1.setName("Rabat Pro Tools");
                s1.setEmail("contact@rabat-pro-tools.demo");
                s1.setPhone("0600001001");
                s1.setLogo(cloudinaryImage("v1782646814/Drill_q4qdqa.png"));
                s1.setAddress("Agdal, Rabat");
                s1.setIsActive(true);
                s1.setIsVerified(true);
                s1.setDeliveryAvailable(true);
                s1.setCreatedAt(Instant.now().minusSeconds(86400 * 45));
                s1.setOwnerId(List.of("U001"));
                s1.setAssociatsIds(List.of("U003"));
                s1.setSocialMedias(List.of("https://instagram.com/rabatprotools"));
                Store s2 = new Store();
                s2.setId("S002");
                s2.setName("Casa Digital Repairs");
                s2.setEmail("hello@casa-digital.demo");
                s2.setPhone("0600001002");
                s2.setLogo(cloudinaryImage("v1780396912/tech_support_b5wce8.png"));
                s2.setAddress("Maarif, Casablanca");
                s2.setIsActive(true);
                s2.setIsVerified(false);
                s2.setDeliveryAvailable(false);
                s2.setCreatedAt(Instant.now().minusSeconds(86400 * 20));
                s2.setOwnerId(List.of("U003"));
                s2.setAssociatsIds(List.of());
                s2.setSocialMedias(List.of("https://linkedin.com/company/casa-digital"));
                storeRepo.saveAll(List.of(s1, s2));
        }

        private void seedProducts() {
                if (productRepo.count() > 0)
                        return;
                productRepo.saveAll(List.of(
                                product("P001", "Professional Drill Bosch GSB 13", 1, 1, 1001,
                                                "High-power electric drill used for construction and repair work", 850,
                                                List.of("tool", "drill", "construction"), "U001", 1, 1, "Rabat",
                                                34.020882, -6.84165, true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646814/Drill_q4qdqa.png")),

                                product("P002", "Electric Hammer Drill Makita", 1, 2, 1002,
                                                "Heavy-duty hammer drill for concrete work", 1200,
                                                List.of("tool", "hammer", "drill"), "U002", 1, 1, "Casablanca",
                                                33.573110, -7.589843, true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646834/hammer_drill_elcwbd.png")),

                                product("P003", "Portable Welding Machine 250A", 2, 3, 2001,
                                                "Industrial welding machine for metalwork", 3200,
                                                List.of("welding", "metal", "construction"), "U003", 2, 1, "Marrakech",
                                                31.629472, -7.981084,
                                                true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646832/Welding_Machine_exnuzj.png")),

                                product("P004", "Air Compressor 50L", 2, 4, 2002,
                                                "Used for painting and pneumatic tools", 1800,
                                                List.of("compressor", "painting", "air"), "U004", 1, 1, "Tangier",
                                                35.759465, -5.834000, true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646816/air_compressor_mqlshu.png")),

                                product("P005", "Industrial Ladder 6m Aluminum", 3, 5, 3001,
                                                "Professional ladder for construction and maintenance", 900,
                                                List.of("ladder", "construction", "safety"), "U005", 1, 1, "Fes",
                                                34.018125, -5.007845, true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646824/lader_zf1q1g.png")),

                                product("P006", "Electric Paint Sprayer Gun", 3, 6, 3002,
                                                "Used for wall painting and finishing work", 700,
                                                List.of("painting", "sprayer", "tool"), "U006", 1, 1, "Agadir",
                                                30.427755, -9.598107, true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646811/paint_sprayer_edzpam.png")),

                                product("P007", "Laser Distance Meter Bosch", 4, 1, 4001,
                                                "Precision measurement tool for engineers", 650,
                                                List.of("laser", "measurement", "construction"), "U007", 1, 1, "Meknes",
                                                33.893531, -5.547269,
                                                true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646812/Laser_Distance_Meter_Bosch_zsmcog.png")),

                                product("P008", "Concrete Mixer Machine Small", 2, 7, 2003,
                                                "Portable cement mixer for construction sites", 5000,
                                                List.of("cement", "construction", "mixer"), "U008", 2, 1, "Oujda",
                                                34.681390, -1.908580, true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646850/Concrete_Mixer_Machine_f6svwe.png")),

                                product("P009", "Electric Angle Grinder", 1, 2, 1003,
                                                "Used for cutting and polishing metal", 550,
                                                List.of("grinder", "tool", "metal"), "U009", 1, 1, "Kenitra", 34.264300,
                                                -6.580100, true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646813/Electric_Angle_Grinder_njvjdp.png")),

                                product("P010", "Construction Safety Helmet Set", 5, 8, 5001,
                                                "Safety helmets for workers", 150,
                                                List.of("safety", "helmet", "construction"), "U010", 1, 1, "Tetouan",
                                                35.588890, -5.362560,
                                                true,
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1782646816/Construction_Safety_Helmet_Set_tim6so.png"))));
        }

        private Product product(String id, String name, int categoryId, int markId, int serieNum, String desc,
                        int price,
                        List<String> tags, String ownerId, int conditionId, int listedForId, String city, double lat,
                        double lon,
                        boolean available, List<String> photoUrls) {
                Product p = new Product();
                p.setId(id);
                p.setName(name);
                p.setCategoryId(categoryId);
                p.setMarkId(markId);
                p.setSerieNum(serieNum);
                p.setDescription(desc);
                p.setPrice(price);
                p.setTags(tags);
                p.setOwnerId(ownerId);
                p.setConditionId(conditionId);
                p.setListedForId(listedForId);
                p.setCurrencyId("MAD");
                p.setDuration(listedForId == 0 ? 0 : 30);
                p.setIsavailable(available);
                p.setCity(city);
                p.setLatitude(lat);
                p.setLongitude(lon);
                p.setLocation(new GeoJsonPoint(lon, lat));
                p.setHidden(false);
                p.setModerationStatus("APPROVED");
                p.setCreatedAt(Instant.now().minusSeconds(86400 * 10));
                p.setUpdatedAt(Instant.now().minusSeconds(3600));
                if (photoUrls != null && !photoUrls.isEmpty()) {
                        p.photoUrls = photoUrls.stream().map(this::cloudinaryImage).toList();
                }
                return p;
        }

        private void seedMasteries() {
                if (masteryRepo.count() > 0)
                        return;
                masteryRepo.saveAll(List.of(

                                mastery("M001", "Ali Ben",  "Active","0600000001", "Plumbing Repair", 1, "FIXED", 300,
                                                "Casablanca", 5,
                                                "Expert plumber for home repairs",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396912/plumber_kyva3b.png")),
                                mastery("M002", "Sara El",  "","0600000002", "House Painting", 2, "PER_HOUR", 150,
                                                "Rabat", 3,
                                                "Interior and exterior painting services",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396902/painter_cpqwvi.png")),
                                mastery("M003", "Youssef Amrani",  "","0600000003", "Electrical Installation", 1,
                                                "FIXED", 400,
                                                "Casablanca", 7, "Certified electrician for residential wiring",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396899/house_wife_tpqq4x.png")),
                                mastery("M004", "Fatima Zahra",  "","0600000004", "House Cleaning", 3, "PER_HOUR",
                                                80,
                                                "Marrakech", 2, "Professional home and office cleaning",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396913/assembly_thecnicien_arpxi9.png")),
                                mastery("M005", "Omar Haddad",  "","0600000005", "Air Conditioning Repair", 1,
                                                "FIXED", 500,
                                                "Tangier", 6, "AC installation and repair specialist",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396918/1780390564_nm00vw.png")),
                                mastery("M006", "Nadia Bennis",  "","0600000006", "Babysitting", 4, "PER_HOUR",
                                                70, "Rabat", 4,
                                                "Certified childcare provider",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396901/nani_mm2cdj.png")),
                                mastery("M007", "Khalid Idrissi",  "","0600000007", "Car Mechanic", 5, "FIXED",
                                                600, "Casablanca",
                                                8, "Full car diagnostics and repair",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396899/mechanic_awvqer.png")),
                                mastery("M008", "Imane Chafik",  "","0600000008", "Graphic Design", 6, "PER_HOUR",
                                                120,
                                                "Marrakech", 3, "Logo and branding designer",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396919/Designer_u7vac6.png")),
                                mastery("M009", "Mehdi Azizi",  "","0600000009", "Web Development", 6, "PER_HOUR",
                                                200,
                                                "Casablanca", 5, "Full-stack web developer",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396918/developper_ipzv8s.png")),
                                mastery("M010", "Salma Raji",  "","0600000010", "Math Tutoring", 7, "PER_HOUR",
                                                90, "Rabat", 6,
                                                "High school math tutor",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396917/tutor_gb3hd5.png")),
                                mastery("M011", "Hassan Ouali",  "","0600000011", "Roof Repair", 1, "FIXED", 700,
                                                "Fes", 10,
                                                "Roofing and waterproofing expert",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396912/roofer_acriwt.png")),
                                mastery("M012", "Rania Bakkali",  "","0600000012", "Makeup Artist", 8, "PER_HOUR",
                                                250,
                                                "Casablanca", 4, "Bridal and event makeup artist",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396903/photographer_tmrskx.png")),
                                mastery("M013", "Adil Najib",  "","0600000013", "Photography", 8, "FIXED", 800,
                                                "Marrakech", 7,
                                                "Event and portrait photographer",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396903/photographer_tmrskx.png")),
                                mastery("M014", "Laila Bennani",  "","0600000014", "Yoga Instructor", 9,
                                                "PER_HOUR", 100, "Rabat",
                                                5, "Certified yoga and wellness coach",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396915/yuga_trainer_rtwbxp.png")),
                                mastery("M015", "Anas Fassi",  "","0600000015", "IT Support", 6, "PER_HOUR", 130,
                                                "Casablanca", 4,
                                                "Technical IT troubleshooting",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396912/tech_support_b5wce8.png")),
                                mastery("M016", "Hiba El Amrani",  "","0600000016", "Interior Design", 8, "FIXED",
                                                1200,
                                                "Tangier", 6, "Modern home interior designer",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396919/Designer_u7vac6.png")),
                                mastery("M017", "Mustapha Reda",  "Welding Services","0600000017", "ACTIVE", 1, "FIXED",
                                                450, "Fes", 9,
                                                "Metal welding and fabrication",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396918/welder_dsxmz4.png")),
                                mastery("M018", "Zineb Ghali",  "","0600000018", "Language Tutor", 7, "PER_HOUR",
                                                110,
                                                "Marrakech", 5, "French and English tutoring",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396913/translator_rq8xam.png")),
                                mastery("M019", "Ayoub Jaber",  "","0600000019", "Delivery Service", 10, "FIXED",
                                                60,
                                                "Casablanca", 2, "Fast local delivery service",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396916/delivery_man_pfzpug.png")),
                                mastery("M020", "Kawtar Mernissi",  "","0600000020", "Hair Stylist", 8,
                                                "PER_HOUR", 180, "Rabat",
                                                6, "Professional hair styling and coloring",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396920/hair_stylist_htl7kb.png")),
                                mastery("M021", "Yassine El Idrissi",  "","0600000021", "Security Services", 11,
                                                "FIXED", 500,
                                                "Casablanca", 7, "Event and private security",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396912/security_ffktpq.png")),
                                mastery("M022", "Nour El Houda",  "","0600000022", "Catering Service", 12,
                                                "FIXED", 1500,
                                                "Marrakech", 8, "Traditional Moroccan catering",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396911/traiteur_ysqp98.png")),
                                mastery("M023", "Hamza Lahlou",  "", "0600000023","Computer Repair", 6,
                                                "PER_HOUR", 140, "Rabat",
                                                4, "Laptop and desktop repair",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396902/pc_Repairman_yksecv.png")),
                                mastery("M024", "Asmae Chraibi",  "", "0600000024","Translation Services", 7,
                                                "PER_HOUR", 120,
                                                "Casablanca", 6, "Arabic, French, English translation",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396913/translator_rq8xam.png")),
                                mastery("M025", "Othman Kabbaj",  "", "0600000025","Gardening", 3, "PER_HOUR", 90,
                                                "Tangier", 5,
                                                "Garden maintenance and landscaping",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396920/gardner_msxrhu.png")),
                                mastery("M026", "Ilham Boussaid",  "", "0600000026","Massage Therapy", 9,
                                                "PER_HOUR", 200,
                                                "Rabat", 4, "Relaxation and therapeutic massage",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396900/massager_olndai.png")),
                                mastery("M027", "Redouane Fadil",  "", "0600000027","Furniture Assembly", 1,
                                                "FIXED", 250,
                                                "Casablanca", 3, "IKEA and custom furniture assembly",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396913/assembly_thecnicien_arpxi9.png")),
                                mastery("M028", "Meryem Saidi",  "", "0600000028","Event Planning", 8, "FIXED",
                                                2000, "Marrakech",
                                                7, "Wedding and corporate event planner",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396911/traiteur_ysqp98.png")),
                                mastery("M029", "Bilal Ait",  "", "0600000029","Locksmith", 1, "FIXED", 350,
                                                "Fes", 6,
                                                "Emergency lock and key services",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396900/locksmith_kvb4qa.png")),
                                mastery("M030", "Siham Laaroussi",  "", "0600000030","Nutrition Coaching", 9,
                                                "PER_HOUR", 160,
                                                "Rabat", 5, "Personal diet and nutrition planning",
                                                List.of("https://res.cloudinary.com/dkmhbowlx/image/upload/v1780396901/nutritionist_y5t1vj.png"))));
        }

        private Mastery mastery(String id, String masterId, String name, String phone, String title, int type,
                        String pricing, int price, String city, int years, String desc, List<String> photoUrls) {
                Mastery m = new Mastery();
                m.setId(id);
                m.setMasterId(masterId);
                m.setMasterName(name);
                m.setMasterPhone(phone);
                m.setTitle(title);
                m.setMasteryTypeId(type);
                m.setMasteryStatuId("ACTIVE");
                m.setPricingType(pricing);
                m.setPrice(price);
                m.setCity(city);
                m.setExperienceYears(years);
                m.setDescription(desc);
                if (photoUrls != null && !photoUrls.isEmpty()) {
                        m.photoUrls = new ArrayList<>(photoUrls.stream().map(this::cloudinaryImage).toList());
                }
                return m;
        }

        private String cloudinaryImage(String imageUrlOrPath) {
                if (imageUrlOrPath == null || imageUrlOrPath.isBlank())
                        return null;
                if (imageUrlOrPath.startsWith("http://") || imageUrlOrPath.startsWith("https://"))
                        return imageUrlOrPath;
                return cloudinaryBaseUrl.replaceAll("/+$", "") + "/" + imageUrlOrPath.replaceAll("^/+", "");
        }

        private void seedDemandes() {
                if (demandeRepo.count() > 0)
                        return;
                Demande d1 = new Demande();
                d1.setId("D001");
                d1.setTitle("Need a hammer drill for weekend work");
                d1.setTypeId(1);
                d1.setPrice(300);
                d1.setDescription("Customer needs a rental hammer drill in Rabat for two days.");
                Demande d2 = new Demande();
                d2.setId("D002");
                d2.setTitle("Looking for garden maintenance");
                d2.setTypeId(3);
                d2.setPrice(500);
                d2.setDescription("Small garden cleanup and maintenance in Tangier.");
                demandeRepo.saveAll(List.of(d1, d2));
        }

        private void seedForum() {
                if (questionRepo.count() > 0 || answerRepo.count() > 0)
                        return;
                Question q = new Question();
                q.setId("Q001");
                q.setAuthorId("U002");
                q.setAuthorName("salma");
                q.setTitle("Which drill is better for concrete walls?");
                q.setBody("Should I rent a hammer drill or a normal drill?");
                q.setTags(List.of("drill", "concrete", "rental"));
                q.setPhotoIds(List.of());
                q.setUpvotes(2);
                q.setUpvotedBy(new ArrayList<>(List.of("U001", "U003")));
                q.setViewCount(12);
                q.setSolved(true);
                q.setAcceptedAnswerId("A001");
                q.setCreatedAt(LocalDateTime.now().minusDays(4));
                q.setUpdatedAt(LocalDateTime.now().minusDays(3));
                questionRepo.save(q);
                Answer a = new Answer();
                a.setId("A001");
                a.setQuestionId("Q001");
                a.setAuthorId("U001");
                a.setAuthorName("yassine");
                a.setBody("For concrete, choose a hammer drill with proper masonry bits.");
                a.setPhotoIds(List.of());
                a.setUpvotes(3);
                a.setUpvotedBy(new ArrayList<>(List.of("U002", "U003", "U004")));
                a.setAccepted(true);
                a.setCreatedAt(LocalDateTime.now().minusDays(3));
                answerRepo.save(a);
        }

        private void seedCommerce() {
                if (cartRepo.count() == 0) {
                        Cart c = new Cart();
                        c.setId("CART001");
                        c.setUserId("U002");
                        c.setStatus(Cart.CartStatus.ACTIVE);
                        c.setCreatedAt(LocalDateTime.now().minusDays(1));
                        c.setUpdatedAt(LocalDateTime.now().minusHours(2));
                        c.setExpiresAt(LocalDateTime.now().plusDays(6));
                        c.setItems(new ArrayList<>(List.of(Cart.CartItem.builder().productId("P001")
                                        .productName("Bosch Professional Drill").price(850).quantity(1)
                                        .listingType(Cart.CartItem.ListingType.RENT)
                                        .startDate(LocalDate.now().plusDays(5))
                                        .endDate(LocalDate.now().plusDays(7)).addedAt(LocalDateTime.now().minusHours(2))
                                        .build())));
                        cartRepo.save(c);
                }
                if (orderRepo.count() == 0) {
                        Order o = new Order();
                        o.setId("O001");
                        o.setBuyerId("U002");
                        o.setBuyerUsername("salma");
                        o.setStatus(Order.OrderStatus.CONFIRMED);
                        o.setPaymentStatus(Order.PaymentStatus.PAID);
                        o.setItems(new ArrayList<>(List.of(Order.OrderItem.builder().productId("P003")
                                        .productName("Portable Welding Machine 250A").ownerId("U003").price(3200)
                                        .quantity(1)
                                        .listingType(Cart.CartItem.ListingType.SALE).rentalDays(0).lineTotal(3200)
                                        .build())));
                        o.setTotalAmount(3200);
                        o.setShippingAddress("Maarif, Casablanca");
                        o.setNote("Please call before delivery");
                        o.setInvoiceNumber("INV-DEMO-001");
                        o.setCreatedAt(LocalDateTime.now().minusDays(8));
                        o.setUpdatedAt(LocalDateTime.now().minusDays(7));
                        orderRepo.save(o);
                }
                if (bookingRepo.count() == 0)
                        bookingRepo.save(Booking.builder().id("B001").productId("P002")
                                        .productName("Makita Hammer Drill")
                                        .ownerId("U001").userId("U002").startDate(LocalDate.now().plusDays(10))
                                        .endDate(LocalDate.now().plusDays(12)).quantity(1).dailyPrice(1200)
                                        .durationDays(2).totalPrice(2400)
                                        .status(Booking.BookingStatus.CONFIRMED)
                                        .createdAt(LocalDateTime.now().minusDays(2))
                                        .updatedAt(LocalDateTime.now().minusDays(1)).build());
                if (paymentRepo.count() == 0)
                        paymentRepo.save(Payment.builder().id("PAY001").orderId("O001").userId("U002").provider("mock")
                                        .providerSessionId("mock_seed_session").status(Payment.PaymentStatus.PAID)
                                        .amount(3200)
                                        .currency("MAD").checkoutUrl("/payments/mock/checkout/O001")
                                        .createdAt(LocalDateTime.now().minusDays(8))
                                        .updatedAt(LocalDateTime.now().minusDays(7)).build());
        }

        private void seedReviewsAndFavorites() {
                if (reviewRepo.count() == 0) {
                        Review r = new Review();
                        r.setId("R001");
                        r.setProductId("P003");
                        r.setUserId("U002");
                        r.setUsername("salma");
                        r.setRating(5);
                        r.setComment("Good equipment and fast delivery.");
                        r.setCreatedAt(LocalDateTime.now().minusDays(5));
                        r.setVerifiedPurchase(true);
                        Review sr = new Review();
                        sr.setId("R002");
                        sr.setMasteryId("M004");
                        sr.setUserId("U001");
                        sr.setUsername("yassine");
                        sr.setRating(4);
                        sr.setComment("Useful IT support service.");
                        sr.setCreatedAt(LocalDateTime.now().minusDays(2));
                        sr.setVerifiedPurchase(false);
                        reviewRepo.saveAll(List.of(r, sr));
                }
                if (favoriteRepo.count() == 0) {
                        Favorite f = new Favorite();
                        f.setId("F001");
                        f.setUserId("U002");
                        f.setProductId("P001");
                        f.setProductName("Bosch Professional Drill");
                        f.setPrice(850);
                        f.setSavedAt(LocalDateTime.now().minusDays(1));
                        favoriteRepo.save(f);
                }
        }

        private void seedMessaging() {
                if (conversationRepo.count() > 0 || chatMessageRepo.count() > 0)
                        return;
                Conversation c = new Conversation();
                c.setId("CONV001");
                c.setParticipantIds(new ArrayList<>(List.of("U001", "U002")));
                c.setProductId("P001");
                c.setLastMessage("Yes, it is available next week.");
                c.setCreatedAt(LocalDateTime.now().minusDays(1));
                c.setUpdatedAt(LocalDateTime.now().minusHours(4));
                conversationRepo.save(c);
                chatMessageRepo.saveAll(List.of(
                                ChatMessage.builder().id("MSG001").conversationId("CONV001").senderId("U002")
                                                .receiverId("U001")
                                                .body("Is the Bosch drill available next week?").read(true)
                                                .createdAt(LocalDateTime.now().minusHours(5)).build(),
                                ChatMessage.builder().id("MSG002").conversationId("CONV001").senderId("U001")
                                                .receiverId("U002")
                                                .body("Yes, it is available next week.").read(false)
                                                .createdAt(LocalDateTime.now().minusHours(4)).build()));
        }

        private void seedNotifications() {
                if (notificationRepo.count() > 0)
                        return;
                notificationRepo.saveAll(List.of(
                                Notification.builder().id("N001").userId("U002").type("ORDER_STATUS")
                                                .title("Order confirmed")
                                                .message("Your order INV-DEMO-001 has been confirmed.")
                                                .referenceId("O001").read(false)
                                                .createdAt(LocalDateTime.now().minusDays(7)).build(),
                                Notification.builder().id("N002").userId("U001").type("NEW_MESSAGE")
                                                .title("New message")
                                                .message("A customer asked about Bosch Professional Drill.")
                                                .referenceId("CONV001").read(true)
                                                .createdAt(LocalDateTime.now().minusHours(5)).build()));
        }

        private void seedVendorVerifications() {
                if (vendorVerificationRepo.count() > 0)
                        return;
                VendorVerification v = new VendorVerification();
                v.setId("V001");
                v.setUserId("U001");
                v.setLegalName("Yassine El Ouardi");
                v.setBusinessName("Rabat Pro Tools");
                v.setDocumentType("TRADE_REGISTER");
                v.setPhotoUrl(cloudinaryImage("v1782646814/Drill_q4qdqa.png"));
                v.setNote("Seeded approved vendor account.");
                v.setStatus(VendorVerification.VerificationStatus.APPROVED);
                v.setReviewedBy("U005");
                v.setReviewComment("Demo verification approved.");
                v.setCreatedAt(LocalDateTime.now().minusDays(40));
                v.setUpdatedAt(LocalDateTime.now().minusDays(39));
                VendorVerification p = new VendorVerification();
                p.setId("V002");
                p.setUserId("U003");
                p.setLegalName("Mehdi Alaoui");
                p.setBusinessName("Casa Digital Repairs");
                p.setDocumentType("CIN");
                p.setPhotoUrl(cloudinaryImage("v1780396912/tech_support_b5wce8.png"));
                p.setNote("Waiting for administrator review.");
                p.setStatus(VendorVerification.VerificationStatus.PENDING);
                p.setCreatedAt(LocalDateTime.now().minusDays(3));
                p.setUpdatedAt(LocalDateTime.now().minusDays(3));
                vendorVerificationRepo.saveAll(List.of(v, p));
        }
}
