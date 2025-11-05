import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '../types';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, replacements?: { [key: string]: string | number }) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations: { [lang in Language]: { [key: string]: string } } = {
  ar: {
    dashboard: 'لوحة التحكم',
    inventory: 'المخزون',
    pos: 'نقطة البيع',
    customers: 'العملاء',
    suppliers: 'الموردون',
    reports: 'التقارير',
    settings: 'الإعدادات',
    language: 'اللغة',
    arabic: 'العربية',
    french: 'الفرنسية',
    total_sales: 'إجمالي المبيعات',
    total_profit: 'إجمالي الأرباح',
    low_stock_items: 'منتجات قاربت على النفاد',
    expired_items: 'منتجات منتهية الصلاحية',
    daily_sales_overview: 'نظرة عامة على المبيعات اليومية',
    recent_transactions: 'المعاملات الأخيرة',
    search_products: 'ابحث عن منتجات...',
    add_product: 'إضافة منتج',
    product_name: 'اسم المنتج',
    category: 'الفئة',
    price: 'السعر',
    quantity_in_stock: 'الكمية في المخزون',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    confirm_delete_product: 'هل أنت متأكد من أنك تريد حذف المنتج "{productName}"؟',
    new_product: 'منتج جديد',
    edit_product: 'تعديل المنتج',
    product_cost: 'تكلفة المنتج',
    low_stock_threshold: 'حد المخزون المنخفض',
    expiry_date: 'تاريخ انتهاء الصلاحية',
    barcode_optional: 'الباركود (اختياري)',
    product_image_url: 'رابط صورة المنتج (اختياري)',
    description_optional: 'الوصف (اختياري)',
    generating: 'جاري الإنشاء...',
    generate_with_ai: 'إنشاء باستخدام الذكاء الاصطناعي',
    cancel: 'إلغاء',
    save_product: 'حفظ المنتج',
    add_new_category: 'إضافة فئة جديدة...',
    search_customers: 'ابحث عن عملاء...',
    add_customer: 'إضافة عميل',
    phone: 'الهاتف',
    address: 'العنوان',
    debt: 'الدين',
    confirm_delete_customer: 'هل أنت متأكد من أنك تريد حذف العميل "{customerName}"؟',
    new_customer: 'عميل جديد',
    edit_customer: 'تعديل العميل',
    save_customer: 'حفظ العميل',
    search_suppliers: 'ابحث عن موردين...',
    add_supplier: 'إضافة مورد',
    supplier_name: 'اسم المورد',
    balance: 'الرصيد',
    confirm_delete_supplier: 'هل أنت متأكد من أنك تريد حذف المورد "{supplierName}"؟',
    new_supplier: 'مورد جديد',
    edit_supplier: 'تعديل المورد',
    save_supplier: 'حفظ المورد',
    app_settings: 'إعدادات التطبيق',
    reset_data_confirm: 'هل أنت متأكد من رغبتك في إعادة تعيين جميع بيانات التطبيق؟ لا يمكن التراجع عن هذا الإجراء.',
    reset_data: 'إعادة تعيين البيانات',
    search_by_name_or_barcode: 'البحث بالاسم أو الباركود...',
    add_to_cart: 'إضافة للسلة',
    cart: 'سلة المشتريات',
    empty_cart: 'السلة فارغة.',
    quantity: 'الكمية',
    total: 'الإجمالي',
    customer: 'العميل',
    no_customer: 'بدون عميل (نقدي)',
    payment_method: 'طريقة الدفع',
    cash: 'نقدي',
    card: 'بطاقة',
    complete_sale: 'إتمام البيع',
    sale_successful: 'تمت عملية البيع بنجاح!',
    print_receipt: 'طباعة الإيصال',
    new_sale: 'عملية بيع جديدة',
    receipt: 'إيصال',
    date: 'التاريخ',
    sold_to: 'مباعة إلى',
    item: 'الصنف',
    subtotal: 'المجموع الفرعي',
    thank_you: 'شكراً لتعاملكم معنا!',
    close: 'إغلاق',
    reports_overview: 'نظرة عامة على التقارير',
    sales_over_time: 'المبيعات عبر الزمن',
    top_selling_products: 'المنتجات الأكثر مبيعاً',
    sales_by_category: 'المبيعات حسب الفئة',
    units_sold: 'الوحدات المباعة',
  },
  fr: {
    dashboard: 'Tableau de bord',
    inventory: 'Inventaire',
    pos: 'Point de Vente',
    customers: 'Clients',
    suppliers: 'Fournisseurs',
    reports: 'Rapports',
    settings: 'Paramètres',
    language: 'Langue',
    arabic: 'Arabe',
    french: 'Français',
    total_sales: 'Ventes totales',
    total_profit: 'Bénéfice total',
    low_stock_items: 'Articles en stock faible',
    expired_items: 'Produits expirés',
    daily_sales_overview: 'Aperçu des ventes quotidiennes',
    recent_transactions: 'Transactions récentes',
    search_products: 'Rechercher des produits...',
    add_product: 'Ajouter un produit',
    product_name: 'Nom du produit',
    category: 'Catégorie',
    price: 'Prix',
    quantity_in_stock: 'Quantité en stock',
    actions: 'Actions',
    edit: 'Modifier',
    delete: 'Supprimer',
    confirm_delete_product: 'Êtes-vous sûr de vouloir supprimer le produit "{productName}" ?',
    new_product: 'Nouveau produit',
    edit_product: 'Modifier le produit',
    product_cost: 'Coût du produit',
    low_stock_threshold: 'Seuil de stock bas',
    expiry_date: "Date d'expiration",
    barcode_optional: 'Code-barres (optionnel)',
    product_image_url: "URL de l'image du produit (optionnel)",
    description_optional: 'Description (optionnel)',
    generating: 'Génération en cours...',
    generate_with_ai: "Générer avec l'IA",
    cancel: 'Annuler',
    save_product: 'Enregistrer le produit',
    add_new_category: 'Ajouter une nouvelle catégorie...',
    search_customers: 'Rechercher des clients...',
    add_customer: 'Ajouter un client',
    phone: 'Téléphone',
    address: 'Adresse',
    debt: 'Dette',
    confirm_delete_customer: 'Êtes-vous sûr de vouloir supprimer le client "{customerName}" ?',
    new_customer: 'Nouveau client',
    edit_customer: 'Modifier le client',
    save_customer: 'Enregistrer le client',
    search_suppliers: 'Rechercher des fournisseurs...',
    add_supplier: 'Ajouter un fournisseur',
    supplier_name: 'Nom du fournisseur',
    balance: 'Solde',
    confirm_delete_supplier: 'Êtes-vous sûr de vouloir supprimer le fournisseur "{supplierName}" ?',
    new_supplier: 'Nouveau fournisseur',
    edit_supplier: 'Modifier le fournisseur',
    save_supplier: 'Enregistrer le fournisseur',
    app_settings: "Paramètres de l'application",
    reset_data_confirm: "Êtes-vous sûr de vouloir réinitialiser toutes les données de l'application ? Cette action est irréversible.",
    reset_data: 'Réinitialiser les données',
    search_by_name_or_barcode: 'Recherche par nom ou code-barres...',
    add_to_cart: 'Ajouter au panier',
    cart: 'Panier',
    empty_cart: 'Le panier est vide.',
    quantity: 'Quantité',
    total: 'Total',
    customer: 'Client',
    no_customer: 'Sans client (au comptant)',
    payment_method: 'Moyen de paiement',
    cash: 'Espèces',
    card: 'Carte',
    complete_sale: 'Finaliser la vente',
    sale_successful: 'Vente réussie !',
    print_receipt: 'Imprimer le reçu',
    new_sale: 'Nouvelle vente',
    receipt: 'Reçu',
    date: 'Date',
    sold_to: 'Vendu à',
    item: 'Article',
    subtotal: 'Sous-total',
    thank_you: 'Merci pour votre visite !',
    close: 'Fermer',
    reports_overview: 'Aperçu des rapports',
    sales_over_time: 'Ventes au fil du temps',
    top_selling_products: 'Produits les plus vendus',
    sales_by_category: 'Ventes par catégorie',
    units_sold: 'Unités vendues',
  }
};

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const translate = (key: string, replacements?: { [key: string]: string | number }) => {
    let translation = translations[language][key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  };

  const value = { language, setLanguage, translate };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
