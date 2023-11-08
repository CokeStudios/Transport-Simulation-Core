package org.mtr.core.oba;

import org.mtr.core.data.Platform;
import org.mtr.core.data.Trip;
import org.mtr.core.generated.oba.ArrivalAndDepartureSchema;
import org.mtr.core.serializer.ReaderBase;
import org.mtr.core.tool.Utilities;

import javax.annotation.Nullable;

public final class ArrivalAndDeparture extends ArrivalAndDepartureSchema {

	public ArrivalAndDeparture(
			Trip trip,
			String tripId,
			Platform platform,
			Trip.StopTime stopTime,
			long scheduledArrivalTime,
			long scheduledDepartureTime,
			boolean predicted,
			long predictedArrivalTime,
			long predictedDepartureTime,
			OccupancyStatus occupancyStatus,
			String vehicleId,
			@Nullable Frequency frequency,
			TripStatus tripStatus
	) {
		super(
				trip.route.getColorHex(),
				tripId,
				0,
				platform.getHexId(),
				stopTime.tripStopIndex,
				trip.route.getRoutePlatforms().size(),
				trip.tripIndexInBlock,
				Utilities.formatName(trip.route.getRouteNumber()),
				Utilities.formatName(trip.route.getName()),
				stopTime.customDestination,
				stopTime.tripStopIndex > 0,
				stopTime.tripStopIndex < trip.route.getRoutePlatforms().size() - 1,
				scheduledArrivalTime,
				scheduledDepartureTime,
				predicted,
				predictedArrivalTime,
				predictedDepartureTime,
				0,
				occupancyStatus,
				0,
				occupancyStatus,
				"default",
				vehicleId
		);
		this.frequency = frequency;
		this.tripStatus = tripStatus;
	}

	public ArrivalAndDeparture(ReaderBase readerBase) {
		super(readerBase);
		updateData(readerBase);
	}

	@Override
	protected Frequency getDefaultFrequency() {
		return null;
	}

	@Override
	protected TripStatus getDefaultTripStatus() {
		return null;
	}
}