import { ResourceCard } from "@components/card/Resource";
import { AppLayout } from "@components/layouts/AppLayout";
import { ChipList } from "@components/ui/ChipList";
import { Resource } from "@definitions/Resource";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { fakeResource } from "@utils/faker.dev";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const ResourceIndex: NextPage<any> = ({
  resources,
}: {
  resources: Resource[];
}) => {
  const [displayables, setDisplayables] = useState(resources);
  const [selected, setSelected] = useState<string[]>([]);

  const [type, setType] = useState(null);
  const [category, setCategory] = useState(null);

  const prepareDisplayable = () => {
    if (selected.length !== 0) {
      let displayables: Resource[] = [];

      resources.forEach((resource) => {
        if (selected.includes(resource.data.type)) displayables.push(resource);
      });
      setDisplayables(displayables);
    } else setDisplayables(resources);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => prepareDisplayable(), [selected]);

  return (
    <AppLayout>
      <div className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <h3 className="mb-2 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
            Toutes les
            <span className="ml-1 text-green-600 dark:text-green-400">
              ressources
            </span>
          </h3>

          <div className="flex flex-col items-center w-full divide-y divide-gray-300 md:flex-row md:divide-y-0 md:divide-x dark:divide-gray-700">
            <div className="inline-flex items-center pb-3 lg:pr-3 md:pb-0">
              <div className="flex items-center overflow-x-auto sm:overflow-x-visible">
                <TypeSelect type={type} setType={setType} />
                {/* <CategorySelect category={category} setCategory={setCategory} /> */}
                <div className="flex items-center mr-2">
                  <button
                    className="flex text-sm font-medium transition duration-300 hover:text-green-500"
                    onClick={() => {
                      setSelected([]);
                      setType(null);
                      setCategory(null);
                    }}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
            <div className="inline-flex pt-3 overflow-x-hidden md:pt-0 md:pl-3">
              <ChipList
                list={[
                  ...Array.from(new Set(resources.map((r) => r.data.type))),
                ]}
                selected={selected}
                setSelected={setSelected}
                size="small"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 p-6 bg-gray-100 grow xl:rounded-tl-xl lg:grid-cols-3 2xl:grid-cols-4 md:grid-cols-2 lg:gap-6 lg:px-32 md:overflow-y-auto">
          {displayables.map((el, index) => (
            <ResourceCard key={index} {...el} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ResourceIndex;

export async function getServerSideProps() {
  const resources: Resource[] = JSON.parse(
    JSON.stringify([fakeResource(), fakeResource()])
  ); // workaround for Date serialization

  return {
    props: { resources },
  };
}

const TypeSelect = ({ type, setType }: any) => {
  return (
    <Menu as="div" className="relative flex items-center h-full">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center justify-between px-2 py-1 mr-2 text-sm font-medium transition duration-300 rounded-xl max-h-12 w-max hover:bg-green-200 hover:text-green-700 dark:hover:bg-green-800 dark:hover:text-green-300">
            {type?.label || "Tout type"}
            <span className="ml-2">
              <ChevronDownIcon className="w-3 h-3" />
            </span>
          </Menu.Button>
          <Transition
            show={open}
            enter="transform transition duration-100 ease-in"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform transition duration-75 ease-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              static
              className={
                "bg-white md:origin-top-left absolute left-0 mt-6 dark:bg-gray-900 text-base z-50 float-left py-2 list-none text-left rounded-xl shadow-lg min-w-48"
              }
            >
              <button
                onClick={() => {
                  setType(null);
                  // closeDropdownPopover();
                }}
                className={
                  "text-sm py-2 px-4 font-normal block w-full text-center whitespace-nowrap hover:text-green-500 dark:hover:text-green-500 transition duration-300 text-gray-700 dark:text-gray-300"
                }
              >
                Tout type
              </button>
              {[
                { label: "Objet physique", value: "physical_item" },
                { label: "Lien externe", value: "external_link" },
                { label: "Emplacement GPS", value: "location" },
                { label: "Autre", value: "other" },
              ].map((el, key) => (
                <button
                  key={key}
                  onClick={() => {
                    setType(el);
                    // closeDropdownPopover();
                  }}
                  className={
                    "text-sm py-2 px-4 font-normal block w-full text-center whitespace-nowrap hover:text-green-500 dark:hover:text-green-500 transition duration-300 text-gray-700 dark:text-gray-300"
                  }
                >
                  {el.label}
                </button>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

const CategorySelect = ({ category, setCategory }: any) => {
  return (
    <Menu as="div" className="relative flex items-center h-full">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center justify-between px-2 py-1 mr-2 text-sm font-medium transition duration-300 rounded-xl max-h-12 w-max hover:bg-green-200 hover:text-green-700 dark:hover:bg-green-800 dark:hover:text-green-300">
            {category?.label || "Any category"}
            <span className="ml-2">
              <ChevronDownIcon className="w-3 h-3" />
            </span>
          </Menu.Button>
          <Transition
            show={open}
            enter="transform transition duration-100 ease-in"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform transition duration-75 ease-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              static
              className={
                "bg-white origin-top-left absolute left-0 mt-6 dark:bg-gray-900 text-base z-50 float-left py-2 list-none text-left rounded-xl shadow-lg min-w-48"
              }
            >
              <button
                onClick={() => {
                  setCategory(null);
                  // closeDropdownPopover();
                }}
                className={
                  "text-sm py-2 px-4 font-normal block w-full text-center whitespace-nowrap hover:text-green-500 dark:hover:text-green-500 transition duration-300 text-gray-700 dark:text-gray-300"
                }
              >
                Any category
              </button>
              {[
                { label: "Art & Culture", value: "art_culture" },
                { label: "Career & Business", value: "career_business" },
                {
                  label: "Community & Environment",
                  value: "community_environment",
                },
                // { label: "Dancing", value: "dancing" },
                { label: "Games", value: "games" },
                // { label: "Health & Wellbeing", value: "health_wellbeing" },
                { label: "Hobbies & Passions", value: "hobbies_passions" },
                // { label: "Identity & Language", value: "identity_language" },
                { label: "Movements & Politics", value: "movements_politics" },
                { label: "Music", value: "music" },
                // { label: "Parents & Family", value: "parents_family" },
                { label: "Pets & Animals", value: "pets_animals" },
                // { label: "Religion & Spirituality", value: "religion_spirituality" },
                { label: "Science & Education", value: "science_education" },
                { label: "Social Activities", value: "socialactivities" },
                { label: "Sports & Fitness", value: "sports_fitness" },
                // { label: "Support & Coaching", value: "support_coaching" },
                { label: "Technology", value: "technology" },
                { label: "Travel & Outdoor", value: "travel_outdoor" },
                // { label: "Writing", value: "writing" },
              ].map((el, key) => (
                <button
                  key={key}
                  onClick={() => {
                    setCategory(el);
                    // closeDropdownPopover();
                  }}
                  className={
                    "text-sm py-2 px-4 font-normal block w-full text-center whitespace-nowrap hover:text-green-500 dark:hover:text-green-500 transition duration-300 text-gray-700 dark:text-gray-300"
                  }
                >
                  {el.label}
                </button>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
