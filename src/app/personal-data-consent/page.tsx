// src/app/personal-data-consent/page.tsx

import type { Metadata } from "next";
import { getOrg } from "@/lib/api/org";
import type { Organization } from "@/types/api";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных — клиника OCTAVA",
  description:
    "Текст согласия на обработку персональных данных для клиентов клиники OCTAVA.",
};

export default async function PersonalDataConsentPage() {
  const org: Organization = await getOrg();

  const orgLine = `${org.fullName}, ОГРН ${org.ogrn}, ИНН ${org.inn}${
    org.kpp ? `, КПП ${org.kpp}` : ""
  }, адрес: ${org.address}`;

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-10 md:py-12">
        <h1 className="text-2xl font-semibold text-[#0D1321] sm:text-3xl">
          Согласие на обработку персональных данных
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Настоящим я, заполняя формы на сайте клиники OCTAVA
          {/* при желании можно добавить домен */}
          , свободно, своей волей и в своём интересе даю согласие оператору
          персональных данных — клинике OCTAVA ({orgLine}) на обработку моих
          персональных данных на условиях, изложенных ниже.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          1. Перечень обрабатываемых персональных данных
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          В рамках настоящего согласия могут обрабатываться следующие
          персональные данные, предоставленные мной через формы на сайте
          или иным способом:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>фамилия, имя, отчество (при наличии);</li>
          <li>контактный номер телефона;</li>
          <li>адрес электронной почты (при указании);</li>
          <li>
            иные сведения, которые я добровольно указываю в поле комментария
            либо сообщаю при общении с сотрудниками клиники.
          </li>
        </ul>

        <p className="mt-2 text-xs text-slate-500">
          Клиника не запрашивает и не требует указывать в формах на сайте
          детальную медицинскую информацию. При необходимости такая
          информация предоставляется при очной консультации врачу.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          2. Цели обработки персональных данных
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Мои персональные данные обрабатываются в следующих целях:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>обработка моего обращения через сайт;</li>
          <li>связь со мной по указанным контактным данным;</li>
          <li>
            запись на консультацию, приём, диагностическое или иное
            мероприятие клиники;
          </li>
          <li>
            предоставление информации об услугах, условиях их оказания и
            стоимости;
          </li>
          <li>
            ведение внутренней отчётности и улучшение качества обслуживания.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          3. Правовые основания обработки
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Обработка персональных данных осуществляется в соответствии
          с законодательством Российской Федерации, включая Федеральный
          закон от 27.07.2006 № 152-ФЗ «О персональных данных», на
          основании настоящего согласия, а также в случаях, когда
          обработка необходима для исполнения договора или для соблюдения
          обязательных требований закона.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          4. Действия с персональными данными
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          В рамках настоящего согласия оператор и уполномоченные им лица
          вправе осуществлять следующие действия с персональными данными:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>сбор, запись, систематизацию, накопление;</li>
          <li>хранение, уточнение (обновление, изменение);</li>
          <li>использование, передачу (предоставление, доступ);</li>
          <li>обезличивание, блокирование, удаление, уничтожение.</li>
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Обработка может осуществляться как с использованием средств
          автоматизации, так и без их использования.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          5. Передача третьим лицам
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Персональные данные могут быть переданы третьим лицам в объёме,
          необходимом для достижения указанных целей, в том числе:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>
            лицам, оказывающим услуги по поддержке и обслуживанию
            информационных систем клиники;
          </li>
          <li>
            лицам, оказывающим клинике услуги по приёму и обработке
            обращений (например, колл-центры), при условии соблюдения
            требований к защите персональных данных;
          </li>
          <li>
            государственным органам в случаях, предусмотренных
            законодательством.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          6. Срок действия согласия
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Согласие действует с момента его предоставления и до момента
          отзыва. После отзыва согласия обработка персональных данных
          может продолжаться в объёме и в течение срока, необходимого
          для выполнения требований законодательства Российской Федерации.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-[#0D1321] sm:text-xl">
          7. Права субъекта персональных данных и порядок отзыва согласия
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Я уведомлён(а), что имею право:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>получать сведения об обработке моих персональных данных;</li>
          <li>требовать уточнения, блокирования или уничтожения данных;</li>
          <li>отозвать настоящее согласие на обработку персональных данных;</li>
          <li>
            обжаловать действия оператора в уполномоченный орган
            по защите прав субъектов персональных данных или в суд.
          </li>
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Отзыв согласия может быть направлен в адрес оператора:
        </p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-slate-700 sm:text-[15px]">
          <li>по почтовому адресу: {org.address};</li>
          <li>
            по электронной почте:{" "}
            <a
              href={`mailto:${org.email}`}
              className="text-[#1D2D44] underline underline-offset-2"
            >
              {org.email}
            </a>
            ;
          </li>
        </ul>

        <p className="mt-6 text-xs text-slate-500">
          Использование сайта и отправка форм обратной связи подтверждают,
          что я ознакомился(лась) с условиями настоящего согласия и{" "}
          <a
            href="/personal-data-policy"
            className="text-[#1D2D44] underline underline-offset-2"
          >
            Политикой обработки персональных данных
          </a>
          .
        </p>
      </section>
    </main>
  );
}
