import { MediaCarouselView } from "@components/Resource/Helper/Media/Carousel";
import { AvatarGroup } from "@components/UI/Avatar/Group";
import { Event } from "@definitions/Resource/Event";
import { UserMinimum } from "@definitions/User";
import {
  CalendarIcon,
  ClockIcon,
  PlusCircleIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "@utils/fetchRSR";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { DateRangePickerCalendar } from "react-nice-dates";

interface EventViewProps {
  attributes: Event;
  slug: string;
  updatedAt: string;
}

export const EventView = ({ attributes, slug, updatedAt }: EventViewProps) => {
  const { user } = useAuth();
  const participate = async () => {
    const res = await fetchRSR(
      `/api/resource/${slug}/participate`,
      user?.session
    );
    const body = await res.json();
    res.ok
      ? setParticipants(
          body.data.attributes.data.attributes.properties.participants
        )
      : console.error(body);
  };
  const [participants, setParticipants] = useState<UserMinimum[]>(
    attributes.properties.participants || []
  );

  const t = useTranslations("ResourceView");
  const { locale } = useRouter();

  return (
    <>
      <div className="overflow-hidden rounded-lg xl:col-span-2">
        <DateRangePickerCalendar
          startDate={new Date(attributes.properties.startDate.toString())}
          endDate={
            attributes.properties.endDate
              ? new Date(attributes.properties.endDate.toString())
              : null
          }
          locale={locale === "fr" ? fr : undefined}
        />
      </div>
      <div className="">
        {attributes.properties.medias ? (
          <MediaCarouselView
            medias={attributes.properties.medias}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-red-800 bg-red-200 rounded-lg dark:text-red-200 dark:bg-red-800">
            <CalendarIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">{t("event")}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <div className="flex flex-col">
          <div className="inline-flex items-center justify-between w-full pt-2 pb-4 space-x-4 ">
            <span className="inline-flex items-center flex-grow space-x-4">
              {attributes.properties.endDate ? (
                <div className="flex flex-col items-center w-6 ml-4 ">
                  <ClockIcon className="w-4 h-4 text-center " />
                  <span className="text-[0.6rem] font-bold uppercase">
                    {t("event-from")}
                  </span>
                </div>
              ) : (
                <ClockIcon className="w-6 h-6 ml-4 text-center" />
              )}

              <div className="flex flex-col">
                <p className="text-xs first-letter:uppercase">
                  {format(new Date(attributes.properties.startDate), "PPPP", {
                    locale: locale === "fr" ? fr : undefined,
                  })}
                </p>
                <p className="text-sm font-bold">
                  {format(new Date(attributes.properties.startDate), "p", {
                    locale: locale === "fr" ? fr : undefined,
                  })}
                </p>
              </div>
            </span>
            <a
              rel="noreferrer"
              href={
                "https://calendar.google.com/calendar/render?action=TEMPLATE&" +
                `dates=${format(
                  new Date(attributes.properties.startDate),
                  "yyyyMMdd'T'HHmmss'Z'"
                )}${
                  attributes.properties.endDate
                    ? "%2F" +
                      format(
                        new Date(attributes.properties.endDate),
                        "yyyyMMdd'T'HHmmss'Z'"
                      )
                    : ""
                }&text=${attributes.properties.name}`
              }
              target="_blank"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/768px-Google_Calendar_icon_%282020%29.svg.png"
                className="h-6 px-3 text-center shrink-0"
                alt="GCalendar"
              ></img>
            </a>
          </div>

          {attributes.properties.endDate && (
            <div className="inline-flex items-center justify-between w-full pt-2 pb-4 space-x-4 ">
              <span className="inline-flex items-center flex-grow space-x-4">
                <div className="flex flex-col items-center w-6 ml-4 ">
                  <ClockIcon className="w-4 h-4 text-center" />
                  <span className="text-[0.6rem] text-center font-bold uppercase">
                    {t("event-to")}
                  </span>
                </div>

                <div className="flex flex-col">
                  <p className="text-xs first-letter:uppercase">
                    {format(new Date(attributes.properties.endDate), "PPPP", {
                      locale: locale === "fr" ? fr : undefined,
                    })}
                  </p>
                  <p className="text-sm font-bold">
                    {format(new Date(attributes.properties.endDate), "p", {
                      locale: locale === "fr" ? fr : undefined,
                    })}
                  </p>
                </div>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col p-3 space-y-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <div className="inline-flex items-center justify-between">
          <h4 className="text-lg font-bold font-spectral">
            {participants.length > 1
              ? t("event-participants-multiple", {
                  length: participants.length,
                })
              : t("event-participants-single", {
                  length: participants.length,
                })}
          </h4>

          {user ? (
            participants.find((p) => p.uid === user.data.uid) ? (
              <button
                onClick={participate}
                className="px-2 py-1 text-xs btn-text-gray"
              >
                <XIcon className="w-4 h-4 mr-1" />
                {t("event-participants-remove")}
              </button>
            ) : (
              <button
                onClick={participate}
                className="px-2 py-1 text-xs btn-text-gray"
              >
                <PlusCircleIcon className="w-4 h-4 mr-1" />
                {t("event-participants-add")}
              </button>
            )
          ) : (
            <Link href="/auth/login">
              <a className="px-2 py-1 text-xs btn-text-gray">
                <UserIcon className="w-4 h-4 mr-1" />
                {t("login")}
              </a>
            </Link>
          )}
        </div>
        <AvatarGroup users={participants} xl />
      </div>
    </>
  );
};
