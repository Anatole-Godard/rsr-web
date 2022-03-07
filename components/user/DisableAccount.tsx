import Image from "next/image";

export const DisableAccount = () => {
  return (
    <div className="flex flex-col row-span-2 p-4 space-y-3 bg-white rounded-lg shadow">
      <div className="inline-flex items-center justify-between w-full mb-3">
        <h5 className="font-bold text-gray-900 font-marianne">
          Désactivation du compte
        </h5>
        <div className="w-6 h-6">
          <Image
            alt="Locker"
            src="/img/locked.png"
            // layout="fill"
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  );
};
