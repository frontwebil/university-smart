# 🎓 University-Smart (USMS)

**Інтелектуальна система управління університетом** — MVP прототип для українського ринку.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6.9-2D3748?style=flat-square&logo=prisma)

## ✨ Функціональність

### 🔐 Авторизація
- Реєстрація нових користувачів (студент / викладач)
- Вхід через email + пароль (NextAuth.js + Credentials)
- JWT-сесії, захищені маршрути через middleware
- Автоматичне перенаправлення на сторінку входу

### 👨‍🎓 Вигляд студента (Електронна заліковка)
- Таблиця дисциплін з балами, кредитами ЄКТС
- Автоматичний розрахунок літерної оцінки ECTS (A–F)
- Автоматичний розрахунок за національною шкалою
- Адаптивний дизайн: картки на мобільних, таблиця на десктопі
- Статистика: кількість дисциплін, середній бал

### 👨‍🏫 Вигляд викладача
- Журнал оцінок усіх студентів
- Форма "Додати оцінку" з Server Actions + Prisma
- ✏️ Редагування оцінок (діалогове вікно)
- 🗑️ Видалення оцінок (з підтвердженням)
- Статистика: кількість студентів, середній бал, відмінники

## 🛠 Технології

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **Prisma ORM** + PostgreSQL (Supabase)
- **NextAuth.js** (Credentials provider, JWT)
- **bcryptjs** для хешування паролів
- **Server Actions** для запису в БД

## 🚀 Швидкий старт

### 1. Клонування та встановлення

```bash
git clone https://github.com/frontwebil/university-smart.git
cd university-smart
npm install
```

### 2. Налаштування .env

Створіть файл `.env`:

```env
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

Згенерувати `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Ініціалізація БД та заповнення даними

```bash
npx prisma db push
npm run db:seed
```

### 4. Запуск

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000)

## 🔑 Тестові акаунти

Пароль для всіх: `password123`

| Роль | Email | Ім'я |
|------|-------|------|
| 👨‍🏫 Викладач | teacher@usms.edu | Проф. Іваненко О.М. |
| 👨‍🎓 Студент | petrenko@usms.edu | Петренко Іван |
| 👩‍🎓 Студент | kovalenko@usms.edu | Коваленко Марія |
| 👨‍🎓 Студент | shevchenko@usms.edu | Шевченко Андрій |
| 👩‍🎓 Студент | bondarenko@usms.edu | Бондаренко Олена |

## 📁 Структура проєкту

```
university-smart/
├── prisma/
│   ├── schema.prisma       # Схема БД (User, Group, Student, Subject, Grade)
│   └── seed.ts             # Mock-дані + тестові акаунти
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Redirect → /dashboard
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── actions.ts
│   │   ├── dashboard/
│   │   │   ├── layout.tsx  # Хедер з інфо юзера + кнопка "Вийти"
│   │   │   ├── page.tsx    # Роутинг по ролях (сесія)
│   │   │   └── actions.ts  # CRUD оцінок (add/edit/delete)
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       └── groups/route.ts
│   ├── components/
│   │   ├── ui/             # Shadcn UI
│   │   ├── student-view.tsx
│   │   ├── teacher-view.tsx
│   │   ├── add-grade-form.tsx
│   │   ├── edit-grade-dialog.tsx
│   │   ├── delete-grade-button.tsx
│   │   └── logout-button.tsx
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── prisma.ts
│   │   ├── grades.ts
│   │   └── utils.ts
│   ├── middleware.ts        # Захист /dashboard/*
│   └── types/
│       └── next-auth.d.ts  # Типи сесії
├── .env.example
└── README.md
```

## 📝 Ліцензія

MIT
