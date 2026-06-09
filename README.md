# 🎓 University-Smart (USMS)

**Інтелектуальна система управління університетом** — MVP прототип для українського ринку.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6.9-2D3748?style=flat-square&logo=prisma)

## ✨ Функціональність

### 👨‍🎓 Вигляд студента (Електронна заліковка)
- Таблиця дисциплін з балами, кредитами ЄКТС
- Автоматичний розрахунок літерної оцінки ECTS (A–F)
- Автоматичний розрахунок за національною шкалою (Відмінно / Добре / Задовільно / Незадовільно)
- Адаптивний дизайн: картки на мобільних, таблиця на десктопі
- Статистика: кількість дисциплін, середній бал

### 👨‍🏫 Вигляд викладача / деканату
- Журнал оцінок усіх студентів
- Форма "Додати оцінку" з Server Actions + Prisma
- Статистика: кількість студентів, середній бал, відмінники

### 🔄 Перемикач ролей (Mock Auth)
- Dropdown у хедері для швидкого перемикання між ролями
- Без реальної автентифікації — через query parameter `?mockUser=`

## 🛠 Технології

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **Prisma ORM** + PostgreSQL
- **Server Actions** для запису в БД

## 🚀 Швидкий старт

### 1. Клонування та встановлення

```bash
git clone https://github.com/frontwebil/university-smart.git
cd university-smart
npm install
```

### 2. Налаштування бази даних

Створіть файл `.env` у корені проєкту:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/university_smart?schema=public"
```

### 3. Ініціалізація БД та заповнення даними

```bash
npx prisma db push
npm run db:seed
```

### 4. Запуск dev-сервера

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000)

## 📁 Структура проєкту

```
university-smart/
├── prisma/
│   ├── schema.prisma       # Схема БД (Group, Student, Subject, Grade)
│   └── seed.ts             # Скрипт заповнення mock-даними
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Кореневий layout
│   │   ├── page.tsx        # Redirect → /dashboard
│   │   ├── globals.css     # Глобальні стилі + CSS-змінні
│   │   └── dashboard/
│   │       ├── layout.tsx  # Layout з хедером та перемикачем ролей
│   │       ├── page.tsx    # Головна сторінка (роутинг по ролях)
│   │       └── actions.ts  # Server Actions (додавання оцінок)
│   ├── components/
│   │   ├── ui/             # Shadcn UI компоненти
│   │   ├── mock-user-switcher.tsx
│   │   ├── student-view.tsx
│   │   ├── teacher-view.tsx
│   │   └── add-grade-form.tsx
│   └── lib/
│       ├── prisma.ts       # Singleton Prisma Client
│       ├── grades.ts       # Утиліти ECTS / Національна шкала
│       └── utils.ts        # cn(), форматування дат
├── .env.example
├── package.json
└── README.md
```

## 📊 Моделі даних

| Модель    | Опис                          |
|-----------|-------------------------------|
| `Group`   | Академічна група (ІПЗ-22-1)  |
| `Student` | Студент з ПІБ та квитком      |
| `Subject` | Дисципліна з кредитами ЄКТС   |
| `Grade`   | Оцінка (0-100) з типом контролю |

### Типи контролю
`МКР` · `Лабораторна` · `Практична` · `Іспит` · `Залік`

## 📝 Ліцензія

MIT
