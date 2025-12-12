// src/app/personal-data-policy/page.tsx

import type { Metadata } from "next";
import { getOrg } from "@/lib/api/org";
import type { Organization } from "@/types/api";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных — клиника OCTAVA",
  description:
    "Политика обработки и защиты персональных данных для пользователей сайта клиники OCTAVA.",
};

export default async function PersonalDataPolicyPage() {
  const org: Organization = await getOrg();
  const primaryPhone =
    org.phones?.find((p) => p.isPrimary) ?? org.phones?.[0];

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-10 md:py-12">
        <h1 className="text-2xl font-semibold text-[#0D1321] sm:text-3xl">
          Политика обработки персональных данных
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Настоящая Политика обработки персональных данных (далее — Политика)
          действует в отношении всей информации, которую клиника OCTAVA
          (оператор персональных данных: {org.fullName}, ОГРН {org.ogrn}, ИНН{" "}
          {org.inn}
          {org.kpp ? `, КПП ${org.kpp}` : ""}, адрес: {org.address}) может
          получить о пользователях сайта и лицах, обращающихся в клинику через
          формы обратной связи, телефон или иным способом.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          1. Общие положения
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Обработка персональных данных осуществляется в соответствии
          с законодательством Российской Федерации, включая Федеральный
          закон от 27.07.2006 № 152-ФЗ «О персональных данных» и иные
          применимые нормативные акты.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Настоящая Политика определяет порядок обработки персональных
          данных и меры по их защите, а также информирует субъектов
          персональных данных о целях, способах обработки и их правах.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          2. Оператор персональных данных
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Оператором персональных данных является {org.fullName}, ОГРН{" "}
          {org.ogrn}, ИНН {org.inn}
          {org.kpp ? `, КПП ${org.kpp}` : ""}, адрес: {org.address}.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          3. Персональные данные и их источники
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          К персональным данным, обрабатываемым оператором, относятся
          сведения, которые пользователь предоставляет самостоятельно
          при:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>заполнении форм на сайте (запись, обратная связь и др.);</li>
          <li>обращении по телефону или через мессенджеры;</li>
          <li>оформлении договора на оказание медицинских услуг;</li>
          <li>
            предоставлении информации при посещении клиники или иным способом.
          </li>
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          В общем случае оператор может обрабатывать следующие категории
          персональных данных:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>фамилия, имя, отчество (при наличии);</li>
          <li>контактные телефоны;</li>
          <li>адрес электронной почты;</li>
          <li>
            иные сведения, добровольно предоставленные субъектом
            персональных данных.
          </li>
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          Медицинская информация и данные о состоянии здоровья обрабатываются
          в рамках отдельной медицинской документации и договоров в соответствии
          с профильным законодательством и внутренними регламентами клиники.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          4. Цели обработки персональных данных
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Персональные данные обрабатываются оператором для следующих целей:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>обработка обращений пользователей и пациентов;</li>
          <li>запись на приём, консультацию, диагностику или процедуру;</li>
          <li>информирование о датах и времени приёмов;</li>
          <li>ответы на запросы по услугам клиники;</li>
          <li>исполнение обязательств по договорам;</li>
          <li>
            улучшение качества обслуживания и анализ работы сервисов клиники;
          </li>
          <li>
            при отдельном согласии — направление информационных и рекламных
            материалов о деятельности и услугах клиники.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          5. Правовые основания обработки
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Обработка персональных данных осуществляется на основании:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>
            согласия субъекта персональных данных на обработку его данных;
          </li>
          <li>
            заключения и исполнения договоров, стороной которых является
            субъект персональных данных;
          </li>
          <li>
            необходимости исполнения обязанностей оператора, установленных
            законодательством Российской Федерации;
          </li>
          <li>
            иных оснований, предусмотренных действующим законодательством.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          6. Способы и сроки обработки персональных данных
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Обработка персональных данных осуществляется с использованием средств
          автоматизации и без их использования. Оператор принимает необходимые
          и достаточные организационные и технические меры для защиты
          персональных данных от неправомерного или случайного доступа,
          уничтожения, изменения, блокирования, копирования, распространения
          и иных неправомерных действий.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Персональные данные хранятся не дольше, чем этого требуют цели их
          обработки, если более длительный срок хранения не предусмотрен
          законодательством Российской Федерации.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          7. Передача персональных данных третьим лицам
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Оператор вправе передавать персональные данные третьим лицам,
          в том числе:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>
            организациям, обеспечивающим функционирование информационных
            систем и сервисов клиники;
          </li>
          <li>
            лицам, оказывающим услуги по приёму обращений и работе с пациентами
            (например, колл-центры), при условии соблюдения требований
            к защите данных;
          </li>
          <li>
            государственным органам и иным уполномоченным структурам в случаях,
            предусмотренных законодательством.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          8. Права субъекта персональных данных
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Субъект персональных данных имеет право:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>получать сведения об обработке его персональных данных;</li>
          <li>требовать уточнения, блокирования или уничтожения данных;</li>
          <li>
            отзывать ранее выданное согласие на обработку персональных данных;
          </li>
          <li>
            обжаловать действия или бездействие оператора в уполномоченный
            орган по защите прав субъектов персональных данных или в суд.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          9. Контакты оператора для вопросов по персональным данным
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          По вопросам, связанным с обработкой персональных данных, а также
          для направления запросов и обращений вы можете связаться с оператором
          по следующим контактам:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>Почтовый адрес: {org.address};</li>
          <li>
            Электронная почта:{" "}
            <a
              href={`mailto:${org.email}`}
              className="text-[#1D2D44] underline underline-offset-2"
            >
              {org.email}
            </a>
            ;
          </li>
          {primaryPhone && (
            <li>
              Телефон:{" "}
              <span className="font-mono">{primaryPhone.number}</span>
            </li>
          )}
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          10. Изменение Политики
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Оператор оставляет за собой право вносить изменения в настоящую
          Политику. Актуальная версия Политики всегда доступна на сайте
          клиники OCTAVA. Продолжение использования сайта и сервисов клиники
          после внесения изменений означает согласие пользователя с
          обновлённой редакцией Политики.
        </p>

        <p className="mt-6 text-xs text-slate-500">
          Настоящая Политика является общедоступным документом и размещена на
          сайте клиники OCTAVA. Рекомендуется периодически знакомиться
          с актуальной редакцией Политики.
        </p>
      </section>
    </main>
  );
}
