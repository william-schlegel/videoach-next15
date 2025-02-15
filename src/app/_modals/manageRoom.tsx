import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
  type FieldErrorsImpl,
  type UseFormRegister,
  type UseFormGetValues,
} from "react-hook-form";
import Modal, { type TModalVariant } from "../ui/modal";
import SimpleForm from "../ui/simpleform";
import { type PropsWithoutRef } from "react";
import { RoomReservation } from "@prisma/client";
import Confirmation from "@ui/confirmation";
import { useTranslation } from "next-i18next";
import { trpc } from "@trpcclient/trpc";
import Spinner from "@ui/spinner";
import { toast } from "react-toastify";

type RoomFormValues = {
  name: string;
  reservation: RoomReservation;
  capacity: number;
  unavailable: boolean;
};

type CreateRoomProps = {
  siteId?: string;
  variant?: TModalVariant;
};

export const RESERVATIONS = [
  { value: RoomReservation.NONE, label: "room.no-reservation" },
  { value: RoomReservation.POSSIBLE, label: "room.reservation-possible" },
  { value: RoomReservation.MANDATORY, label: "room.reservation-mandatory" },
] as const;

export const CreateRoom = ({
  siteId,
  variant = "Icon-Outlined-Primary",
}: CreateRoomProps) => {
  const utils = trpc.useContext();
  const createRoom = trpc.sites.createRoom.useMutation({
    onSuccess: () => {
      utils.sites.getRoomsForSite.invalidate(siteId);
      reset();
      toast.success(t("room.created"));
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<RoomFormValues>();
  const { t } = useTranslation("club");

  const onSubmit: SubmitHandler<RoomFormValues> = (data) => {
    if (siteId)
      createRoom.mutate({
        siteId,
        name: data.name,
        reservation: data.reservation,
        capacity: data.capacity,
        unavailable: false,
        openWithClub: true,
      });
  };

  const onError: SubmitErrorHandler<RoomFormValues> = (errors) => {
    console.error("errors", errors);
  };

  return (
    <>
      <Modal
        title={t("room.new")}
        handleSubmit={handleSubmit(onSubmit, onError)}
        buttonIcon={<i className="bx bx-plus bx-sm" />}
        variant={variant}
      >
        <h3>{t("room.new")}</h3>
        <RoomForm register={register} errors={errors} getValues={getValues} />
      </Modal>
    </>
  );
};

type PropsUpdateDelete = {
  siteId: string;
  roomId: string;
  variant?: TModalVariant;
};

export const UpdateRoom = ({
  siteId,
  roomId,
  variant = "Icon-Outlined-Primary",
}: PropsUpdateDelete) => {
  const utils = trpc.useContext();
  const queryRoom = trpc.sites.getRoomById.useQuery(roomId, {
    onSuccess(data) {
      if (data) reset(data);
    },
  });
  const updateRoom = trpc.sites.updateRoom.useMutation({
    onSuccess: () => {
      utils.sites.getRoomsForSite.invalidate(siteId);
      utils.sites.getRoomById.invalidate(roomId);
      reset();
      toast.success(t("room.updated"));
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<RoomFormValues>();
  const { t } = useTranslation("club");

  const onSubmit: SubmitHandler<RoomFormValues> = (data) => {
    if (siteId)
      updateRoom.mutate({
        id: roomId,
        ...data,
        capacity: data.capacity,
      });
  };

  const onError: SubmitErrorHandler<RoomFormValues> = (errors) => {
    console.error("errors", errors);
  };

  return (
    <>
      <Modal
        title={t("room.update")}
        handleSubmit={handleSubmit(onSubmit, onError)}
        buttonIcon={<i className="bx bx-edit bx-sm" />}
        variant={variant}
      >
        <h3>{t("room.update")}</h3>
        {queryRoom.isLoading ? (
          <Spinner />
        ) : (
          <RoomForm register={register} errors={errors} getValues={getValues} />
        )}
      </Modal>
    </>
  );
};

export const DeleteRoom = ({
  roomId,
  siteId,
  variant = "Icon-Outlined-Secondary",
}: PropsWithoutRef<PropsUpdateDelete>) => {
  const utils = trpc.useContext();
  const { t } = useTranslation("club");

  const deleteRoom = trpc.sites.deleteRoom.useMutation({
    onSuccess: () => {
      utils.sites.getRoomsForSite.invalidate(siteId);
      toast.success(t("room.deleted"));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <Confirmation
      message={t("room.deletion-message")}
      title={t("room.deletion")}
      buttonIcon={<i className="bx bx-trash bx-sm" />}
      onConfirm={() => {
        deleteRoom.mutate(roomId);
      }}
      variant={variant}
    />
  );
};

type RoomFormProps = {
  errors?: FieldErrorsImpl;
  register: UseFormRegister<RoomFormValues>;
  getValues: UseFormGetValues<RoomFormValues>;
};

function RoomForm({ errors, register, getValues }: RoomFormProps): JSX.Element {
  const { t } = useTranslation("club");
  return (
    <SimpleForm
      errors={errors}
      register={register}
      fields={[
        {
          label: t("room.name"),
          name: "name",
          required: t("name-mandatory"),
        },
        {
          label: t("room.capacity"),
          name: "capacity",
          type: "number",
        },
        {
          name: "reservation",
          component: (
            <select
              defaultValue={getValues("reservation")}
              {...register("reservation")}
            >
              {RESERVATIONS.map((reservation) => (
                <option key={reservation.value} value={reservation.value}>
                  {t(reservation.label)}
                </option>
              ))}
            </select>
          ),
        },
        {
          name: "unavailable",
          component: (
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="checkbox-primary checkbox"
                  {...register("unavailable")}
                  defaultChecked={false}
                />
                <span className="label-text">{t("room.unavailable")}</span>
              </label>
            </div>
          ),
        },
      ]}
    />
  );
}
