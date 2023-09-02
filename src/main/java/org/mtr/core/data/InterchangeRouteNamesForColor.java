package org.mtr.core.data;

import it.unimi.dsi.fastutil.objects.ObjectArrayList;
import org.mtr.core.generated.InterchangeRouteNamesForColorSchema;
import org.mtr.core.serializers.ReaderBase;

import java.util.function.Consumer;

public final class InterchangeRouteNamesForColor extends InterchangeRouteNamesForColorSchema {

	public InterchangeRouteNamesForColor(long color) {
		super(color);
	}

	public InterchangeRouteNamesForColor(ReaderBase readerBase) {
		super(readerBase);
		updateData(readerBase);
	}

	public void forEach(Consumer<String> consumer) {
		routeNames.forEach(consumer);
	}

	int getColor() {
		return (int) (color & 0xFFFFFF);
	}

	void addRouteNames(ObjectArrayList<String> routeNames) {
		this.routeNames.addAll(routeNames);
	}
}